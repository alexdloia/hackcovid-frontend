const functions = require('firebase-functions');

const admin = require('firebase-admin');
let serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "hackcovid-project.appspot.com"
});

let bucket = admin.storage().bucket();
let db = admin.firestore();
const defaultImageUrl = "https://firebasestorage.googleapis.com/v0/b/hackcovid-project.appspot.com/o/default_hackcovid.jpg?alt=media";

const express = require('express');
const cors = require('cors');
const { check, validationResult } = require("express-validator");
const { filesUpload } = require('./middleware');

const contactTeamApp = express();
const processPostApp = express();

const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
    port: 465,
    secure: true,
    host: "smtp.migadu.com",
    auth: {
        user: "admin@hackcovid.dev",
        pass: "hackCOVID2020"
    }
});

let slugify = require("slugify");

async function mailSender(message) {
    console.log("starting mailSender");
    try {
        console.log("sending mail");
        await transporter.sendMail(message);
        return true;
    } catch (err) {
        console.log("caught error in mailsender")
        console.log(err);
        return false;
    }
    //    let send = verified.then( ( success ) => { 
    //        console.log("calling nodemailer");
    //        transporter.sendMail(message)
    //            .catch( (err) => {
    //                console.log(err)
    //                throw new Error(err);
    //            });
    //        return true;
    //    })
    //    .catch( (err) => {
    //        console.log(err)
    //        throw new Error(err);
    //    });
}


const uploadFile = (file) => new Promise((resolve, reject) => {
    const originalname = file.originalname;
    const buffer = file.buffer;
    console.log(`Starting upload of ${originalname}`);

    const blob = bucket.file(originalname.replace(/ /g, "_"));
    const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
            contentType: file.mimetype
        }
    });
    blobStream.on('finish', () => {
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${blob.name}?${file.mimetype.includes("image") ? "?alt=media" : ""}`;
        resolve(publicUrl);
    })
        .on('error', () => {
            reject(new Error("Unable to upload image, something went wrong"));
        })
        .end(buffer);
});

function remindToReviewNewProject(projectTitle) {
    let message = {
        from: [{
            name: "HackCOVID Support",
            address: "admin@hackcovid.dev"
        }],
        to: "hackcovid@googlegroups.com",
        subject: `New Project "${projectTitle}" Awaiting Approval - HackCOVID`,
        html: `
				<h1>A New Project Has Been Posted</h1>
				<p>Please review the project for approval</p>
				<br />
				<small>Title: ${projectTitle}</small>
				`
    };

    console.log("calling mailsender");
    mailSender(message);
}

function createTeamContactMessageFromReq(reqData, reqFiles) {
    let attachment_message = reqFiles.length ? "Files were also attached to this message." : "";
    let htmlBody = `
                    <h1>New message from ${reqData.name}:</h1>
                    <p>${reqData.message}</p>
                    <p>Simply reply to start a conversation. ${attachment_message}</p>
                    <p>Thank you for using HackCOVID!</p>
                    `;

    let attachmentList = (reqFiles ? reqFiles.map((file) => {
        return {
            filename: file.originalname,
            contentType: file.mimetype,
            content: file.buffer
        };
    }) : []);

    return {
        from: [{
            name: "HackCOVID Support",
            address: "admin@hackcovid.dev"
        }],
        replyTo: [{
            name: reqData.name,
            address: reqData.user_email
        }],
        to: reqData.team_email,
        subject: `${reqData.name} would like to get in touch - HackCOVID`,
        html: htmlBody,
        attachments: attachmentList
    };
}

contactTeamApp.post(['/contact', '/'], filesUpload, [
    check('user_email').not().isEmpty().isEmail().normalizeEmail(),
    check('team_email').not().isEmpty().isEmail().normalizeEmail(),
    check('name').not().isEmpty().trim(),
    check('message').not().isEmpty().trim()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let reqData = req.body;
    let reqFiles = req.files;

    console.log("calling mailsender");
    if (mailSender(createTeamContactMessageFromReq(reqData, reqFiles))) {
        res.status(200).send();
    } else {
        res.status(500).send();
    }
});

async function finishProcessingPost(docId, reqData) {
    console.log("entering finishProcessingPost");
    db.collection("projects").doc(docId).set(Object.assign({}, reqData, { id: docId, approved: false }));
    console.log("getting category doc");
    let catQuery = db.collection("categories").doc(reqData.category);
    let categoryDoc = await catQuery.get();
    try {
        let docData = categoryDoc.data();
        if (docData && docData.hasOwnProperty("empty")
            && docData.empty) {
            catQuery.update({ empty: false });
        }
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
    //        categoryDoc.get().then( (doc) => {
    //            console.log("checking if category is empty");
    //            try {
    //                let docData = doc.data();
    //                if(docData && docData.hasOwnProperty("empty") 
    //                    && docData.empty) {
    //                    categoryDoc.update({empty: false});
    //                }
    //            } catch(err) {
    //                console.log(err);
    //                throw new Error(err);
    //            }
    //            return true;
    //        })
    //        .catch( (err) => {
    //            console.log(err);
    //            throw new Error(err);
    //        });
    remindToReviewNewProject(reqData.title);
}

processPostApp.post(['/post_position', '/'], filesUpload,
    [
        check("email").isEmail().normalizeEmail(),
        check("title").trim(),
        check("pos_title").trim(),
        check("type_details").trim(),
        check("looking").trim(),
        check("requested").trim(),
        check("location").trim(),
        check("summary").isLength({ max: 200 }).trim(),
        check("team_desc").trim(),
        check("pos_desc").trim(),
        check("remote").toBoolean(),
        check("team_name").trim()
    ],
    async (req, res) => {
        console.log("checking validation");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let reqData = req.body;
        console.log("header status: ", res.headersSent ? "sent" : "not sent");

        if (reqData.requested) {
            reqData.requested = reqData.requested.split(", ");
        } else {
            res.status(400).send();
            return;
        }

        let docId = slugify(reqData.title) + "-" + Date.now().toString();

        if (!req.files.length) {
            console.log("no file");
            reqData.imageUrl = defaultImageUrl;
            console.log("header status: ", res.headersSent ? "sent" : "not sent");
            await finishProcessingPost(docId, reqData);
            console.log("header status: ", res.headersSent ? "sent" : "not sent");
            console.log("about to redirect");
            console.log("header status: ", res.headersSent ? "sent" : "not sent");
            res.redirect('/post');
            console.log("header status: ", res.headersSent ? "sent" : "not sent");
            return;
        } else {
            let image = req.files[0];
            uploadFile(image)
                .then(async (publicUrl) => {
                    console.log("upload success");
                    reqData.imageUrl = publicUrl;
                    await finishProcessingPost(docId, reqData);
                    console.log("about to redirect");
                    res.redirect('/post');
                    return true;
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).json(error);
                    throw new Error(error);
                });
        }
    });

exports.contactTeamHandler = functions.https.onRequest(contactTeamApp);
exports.processPostHandler = functions.https.onRequest(processPostApp);

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

function mailSender(message) {
	console.log("starting mailSender");
    let verified = transporter.verify();
    let send = verified.then( ( success ) => { 
        transporter.sendMail(message);
        return true;
    });

    return Promise.all([verified, send])
        .then( (vals) => {
            console.log("Email sent successfully!");
            return 200;
        })
        .catch( (err) => {
            console.log("Something went wrong in sending");
            console.log(err);
            throw new Error(err);
        });
}


const uploadFile = (file) => new Promise((resolve, reject) => {
  	const  originalname = file.originalname;
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
    	const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${blob.name}?${ file.mimetype.includes("image") ? "?alt=media" : "" }`;
    	resolve(publicUrl);
  	})
  	.on('error', () => {
    	reject(new Error("Unable to upload image, something went wrong"));
  	})
  	.end(buffer);
});

remindToReviewNewProject = (projectTitle) => {	
	let message = {
		from: [ {
			name: "HackCOVID Support",
			address: "admin@hackcovid.dev"
		} ],
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
	mailSender(message)
		.then( (status) => {
			console.log("mailSender succeeded")
            return true;
		})
		.catch( (err) => {
			console.log("something went wrong in mailSender")
            throw new Error(err);
		});
};

function createTeamContactMessageFromReq(reqData, reqFiles) {
    let attachment_message = reqFiles ? "Files were also attached to this message." : "";
    let htmlBody = `
                    <h1>New message from ${reqData.name}:</h1>
                    <p>${reqData.message}</p>
                    <p>Simply reply to start a conversation. ${attachment_message}</p>
                    <p>Thank you for using HackCOVID!</p>
                    `;


    return {
        from: [ {
            name: "HackCOVID Support",
            address: "admin@hackcovid.dev"
        } ],
        replyTo: [ { name: reqData.name,
            address: reqData.user_email 
            } ],
        to: reqData.team_email,
        subject: `${reqData.name} would like to get in touch - HackCOVID`,
        html: htmlBody,
        attachments: reqFiles ? reqFiles.map( (file) => {
            return {
                filename: file.originalname,
                contentType: file.mimetype,
                content: file.buffer
            };
        }) : []
    };
}

contactTeamApp.post(['/contact', '/'], filesUpload, [
        check('user_email').isEmail().normalizeEmail(),
        check('name').not().isEmpty().trim().escape(),
        check('message').trim().escape()
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        if (["localhost", "hackcovid.dev"].includes(req.hostname)) {
            let reqData = req.body;
            let reqFiles = req.files;
            
            console.log("calling mailsender");
                mailSender(createTeamContactMessageFromReq(reqData, reqFiles))
                    .then( (status) => {
                        console.log("mailSender succeeded")
                        res.status(status).send();
                        return true;
                    })
                    .catch( (err) => {
                        console.log("something went wrong in mailSender")
                        res.status(500).json(err);
                        throw new Error(err);
                    });

        } else {
            console.log("not from an authorized hostname");
            res.status(401).send();
        }
});


processPostApp.post(['/post_position', '/'], filesUpload, 
    [
        check("email").isEmail().normalizeEmail(),
        check("title").trim().escape(),
        check("pos_title").trim().escape(),
        check("type_details").trim().escape(),
        check("looking").trim().escape(),
        check("requested").trim().escape(),
        check("location").trim().escape(),
        check("summary").isLength({ max: 200 }).trim().escape(),
        check("team_desc").trim().escape(),
        check("pos_desc").trim().escape(),
        check("remote").toBoolean(),
    ], 
    (req, res) => {
        console.log("checking validation");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        if(["localhost", "hackcovid.dev"].includes(req.hostname)) {
            let reqData = req.body;

            if (reqData.requested) {
                reqData.requested = reqData.requested.split(", ");
            } else {
                res.status(400).send();
                return;
            }
            
            let docId = slugify(reqData.title) + "-" + Date.now().toString();

            if (!req.files.length) {
                reqData.imageUrl = defaultImageUrl;
                db.collection("projects").doc(docId).set(Object.assign({}, reqData, {id: docId}, {approved: false}));
                res.send('/projects');
                remindToReviewNewProject(reqData.title);
            } else {
                let image = req.files[0];
                uploadFile(image)
                    .then( (publicUrl) => {
                        console.log("upload success");
                        reqData.imageUrl = publicUrl;
                        db.collection("projects").doc(docId).set(Object.assign({}, reqData, {id: docId}, {approved: false}));
                        res.send('/projects');
                        remindToReviewNewProject(reqData.title);
                        return true;
                    })
                    .catch( (error) => {
                        console.log(error);
                        res.status(500).json(error);
                        throw new Error(error);
                    });
            }
        } else {
            console.log("not from an authorized hostname");
            res.status(401).send();
        }
});
		
exports.contactTeamHandler = functions.https.onRequest(contactTeamApp);
exports.processPostHandler = functions.https.onRequest(processPostApp);

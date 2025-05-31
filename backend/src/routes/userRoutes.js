import express from "express";
const router = express.Router();

router.post('/send-friend-request');
router.post('/accept-fiendrequest');
router.post('/send-invite-to-room');
router.post('/get-friend-requests');
router.post('/get-room-invites');

export default router;
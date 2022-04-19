const express = require('express');
const EventController = require("../../controllers/EventController");
const PackageController = require("../../controllers/PackageController");
const Auth = require("../../middlewares/Auth");
const { 
    validate, 
    eventValidation, 
    reviewValidation, 
    commentValidation,
    donationValidation,
    inviteValidation,
    purchaseTicketValidation,
    promoteValidation,
    commentReviewValidation,
    marchendiseValidation,
    purchaseMerchandiseValidation
} = require("../../helpers/validators");

const router = express.Router();

router.post('/events/create/event', eventValidation(), validate, Auth, EventController.createEvent);

router.get("/events/get-events", Auth, EventController.getAllEvents);

router.get("/events/fetch-events-by-type", Auth, EventController.getEventBasedOnType);

router.get("/events", Auth, EventController.filterEvents);

router.get("/events/event-details/:id", Auth, EventController.getEventDetails);

router.delete("/events/delete-event/:id", Auth, EventController.deleteEvent);

router.patch("/events/update-event/:id", Auth, EventController.updateEvent);

router.post("/events/add-rating", reviewValidation(), validate, Auth, EventController.addRating);

router.post("/events/add-comment", commentValidation(), validate, Auth, EventController.addComment);

router.post("/events/add-donation", donationValidation(), validate, Auth, EventController.addDonation);

router.get("/events/invitations/:eventId", Auth, EventController.invitations);

router.get("/events/donations/:eventId", Auth, EventController.donations);

router.post("/events/request/invite", Auth, EventController.requestForInvite);

router.patch("/events/accept/invite", inviteValidation(), validate, Auth, EventController.acceptInvite);

router.post("/events/purchase-ticket", purchaseTicketValidation(), validate, Auth, EventController.purchaseEventTicket);

router.get("/events/tickets/:eventId", Auth, EventController.ticketsPurchased);

router.get("/events/engagements/:eventId", Auth, EventController.eventEngagements);

router.get("/event/promotion-plan", PackageController.promotionPlan);

router.post("/events/promote-event", promoteValidation(), validate, Auth, PackageController.subscribeToPlan);

router.get("/events/comments/:eventId", Auth, EventController.getEventComments);

router.post("/events/comment/add-rating", commentReviewValidation(), validate, Auth, EventController.addCommentRating);

router.get("/events/comment/rating/:commentId", Auth, EventController.getEventCommentRating);

router.patch("/events/cancel/:id", Auth, EventController.cancelEvent);

router.patch("/events/postpone/:id", Auth, EventController.postponeEvent);

router.get("/events/hottest-event", Auth, EventController.hottestEvent);

router.get("/events/promoted-events", Auth, EventController.promotedEvents);

// Filters
router.post("/events/filter-upload", Auth, EventController.uploadFilter);

router.get("/events/filters/:eventId", Auth, EventController.eventFilters);

// Merchandise
router.post("/events/add-merchandise", marchendiseValidation(), validate, Auth, EventController.createMerchandise);

router.get("/events/merchandises/:eventId", Auth, EventController.getMerchandises);

router.patch("/events/update-merchandise/:id", Auth, EventController.updateMerchandise);

router.delete("/events/delete-merchandise/:id", Auth, EventController.deleteMerchandise);

router.post("/events/purchase-merchandise", purchaseMerchandiseValidation(), validate, Auth, EventController.purchaseEventMerchandise);

router.get("/events/banners", EventController.getBanners);

router.post("/events/send-reminder", Auth, EventController.sendInviteReminder);

module.exports = router;
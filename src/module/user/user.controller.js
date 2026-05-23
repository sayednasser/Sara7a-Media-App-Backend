import Router from "express";
import { 
    coverProfile, 
    imageProfile, 
    logout, 
    getProfileWithMessages, 
    rotateToken, 
    shareProfile, 
    toggleAllowMessages, 
    updatePassword, 
    updateProfile, 
    toggleMessagePublic,
    toggleMessageHide // 🔥 استيراد الدالة الجديدة من الـ service
} from "./user.service.js";
import { filedValidation, RoleEnum, successRequest, uploadFileCloud } from "../../common/index.js";
import { authentication, authorization, validation } from "../../middleware/index.js";
import * as validators from "./user.validation.js";

const router = Router();

router.get("/profile", authentication(), async (req, res, next) => {
    const account = await getProfileWithMessages(req.user);
    return successRequest({ res, data: account });
});

router.patch("/toggle-messages", authentication(), async (req, res, next) => {
    const result = await toggleAllowMessages(req.user);
    return successRequest({ res, data: result });
});

router.patch("/toggle-message-public", authentication(), async (req, res, next) => {
    const result = await toggleMessagePublic(req.body.messageId, req.user);
    return successRequest({ res, data: result });
});

// 🔥 الـ Route الجديد الخاص بميزة إخفاء الرسائل
router.patch("/toggle-message-hide", authentication(), async (req, res, next) => {
    const result = await toggleMessageHide(req.body.messageId, req.user);
    return successRequest({ res, data: result });
});

router.get("/rotate-token", authentication(RoleEnum.User), async (req, res, next) => {
    const account = await rotateToken(req.user, `${req.protocol}://${req.host}`);
    return successRequest({ res, data: account });
});

router.get("/share/:userId", async (req, res, next) => {
    const account = await shareProfile(req.params.userId);
    return successRequest({ res, data: account });
});

router.patch("/update-profile", authentication(), validation(validators.updateProfile), async (req, res, next) => {
    console.log(req.body);
    const account = await updateProfile(req.body, req.user, `${req.protocol}://${req.host}`);
    return successRequest({ res, data: account });
});

router.patch("/update-password", authentication(), validation(validators.updatePassword), async (req, res, next) => {
    const account = await updatePassword(req.body, req.user, `${req.protocol}://${req.host}`);
    return successRequest({ res, data: account });
});

router.patch("/profile-picture", authentication(), uploadFileCloud({ validation: filedValidation.image }).single("image"), validation(validators.profileImage), async (req, res, next) => {
    const account = await imageProfile(req.file, req.user);
    return successRequest({ res, data: account });
});

router.patch("/cover-picture", authentication(), uploadFileCloud({ validation: filedValidation.image }).array("attachment", 2), validation(validators.coverImage), async (req, res, next) => {
    console.log(req.files);
    const account = await coverProfile(req.files, req.user);
    return successRequest({ res, status: 200, data: account });
});

router.post("/logout", authentication(), async (req, res, next) => {
    const status = await logout(req.body, req.user, req.decode);
    return successRequest({ res, status });
});

export default router;
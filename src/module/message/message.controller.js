import Router from "express";
import { filedValidation, successRequest, uploadFileCloud } from "../../common/index.js";
import { authentication, validation } from "../../middleware/index.js";
import * as validators from "./message.validation.js"
import { createMessage, deleteMessage, getMessage, listMessage ,toggleFavoriteMessage} from "./message.service.js";
const router = Router()

router.post("/:receiverId",
    uploadFileCloud({ validation: filedValidation.image, size: 5 }).array("attachment", 5),
    validation(validators.messageValidation),
    async (req, res, next) => {
        const message = await createMessage(req.body, req.files, req.params.receiverId)
        return successRequest({ res, status: 201, message: "message sent successfully", data: message })
    })
router.get("/list", authentication(), async (req, res, next) => {
    const message = await listMessage(req.user)
    return successRequest({ res, message: "all message retrieved successfully", data: message })
})
router.get("/:messageId", authentication(), validation(validators.getMessage), async (req, res, next) => {
    const message = await getMessage(req.params.messageId, req.user)
    return successRequest({ res, message: "message retrieved successfully", data: message })
}) 
router.patch("/favorite/:messageId", 
    authentication(), 
    async (req, res, next) => {
        const result = await toggleFavoriteMessage(req.params.messageId, req.user);
        return successRequest({ res, data: result });
    }
);
router.delete("/:messageId", authentication(), async (req, res, next) => {
    const message = await deleteMessage(req.params.messageId, req.user)
    return successRequest({ res, message: "message Deleted successfully" })
}) 

 
export default router

import messageModel from "../models/message.model.js"
export default class MessageManager {
    getMessages = async () => {
        try {
            return await messageModel.find().lean();
        } catch (error) {
            console.error("Error al obtener mensajes:", error)
            return error
        }
    }
    

    createMessage = async (message) => {
        if (message.user.trim() === '' || message.message.trim() === '') {
            console.warn("Intento de crear un mensaje vacío.")
            return null;
    }

    try {
        return await messageModel.create(message)
    } catch (error) {
        console.error("Error al crear mensaje:", error)
        return error
    }
}

deleteAllMessages = async () => {
try {
    console.log("Deleting all messages...")
    const result = await messageModel.deleteMany({})
    console.log("Messages deleted:", result)
    return result
    } catch (error) {
        console.error("Error deleting messages:", error)
        return error
        }
    }
}
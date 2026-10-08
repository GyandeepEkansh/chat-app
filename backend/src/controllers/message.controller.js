import User from '../models/user.model.js';
import Message from '../models/message.model.js';

export const getUsersForSideBar = async (req, res) => {
    try {
        const loggedInUserId = req.user.id; // Assuming you have the logged-in user's ID in req.user
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password'); // Exclude the password field from the results
        // Send the filtered users as a response
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSideBar:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const {id:userToChatId} = req.params;
        const myId = req.user.id; // Assuming you have the logged-in user's ID in req.user

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const{text,image} = req.body;
        const{id:receiverId} = req.params;
        const senderId = req.user.id; // Assuming you have the logged-in user's ID in req.user

        let imageUrl;
        if(image){
            // Upload the image to Cloudinary and get the URL
            const uploadResponse= await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl, // Set image to null if not provided
        });

        await newMessage.save();

        //todo: realtime functionality using socket.io

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
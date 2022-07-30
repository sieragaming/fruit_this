import mongoose from 'mongoose'

const url = process.env.MONGODB_URL
const connectDB = () => {
    if (mongoose.connections[0].readyState) {
        console.log('Already Connect')
        return
    }
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => console.log("Database Connected")).catch(error => console.log(error.message))
}
export default connectDB
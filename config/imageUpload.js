const CLOUD_UPDATE_PRESET = "agung_store"
const CLOUD_NAME = "sierragaming"
const CLOUD_API = "https://api.cloudinary.com/v1_1/sierragaming/image/upload"

export const imageUpload = async (images) => {
    let imgArr = []
    for (const item of images) {
        const formData = new FormData()
        formData.append("file", item)
        formData.append("upload_preset", CLOUD_UPDATE_PRESET)
        formData.append("cloud_name", CLOUD_NAME)

        const res = await fetch(CLOUD_API, {
            method: "POST",
            body: formData
        })

        const data = await res.json()
        imgArr.push({ public_id: data.public_id, url: data.secure_url })
        console.log(imgArr)
    }
    return imgArr;
}
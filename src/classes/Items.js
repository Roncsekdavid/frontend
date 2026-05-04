export default class Items{
    #id;
    #description;
    #estimated_value;
    #user_id;
    #status;
    #name;
    #upload_date;
    #category;
    #item_images;


    constructor(id, description, estimated_value, user_id, status, name, upload_date, category, item_images){
        this.#id = id;
        this.#description = description;
        this.#estimated_value = estimated_value;
        this.#user_id = user_id;
        this.#status = status;
        this.#name = name;
        this.#upload_date = upload_date;
        this.#category = category;
        this.#item_images = item_images

        this.getId = this.getId.bind(this);
        this.getDescription = this.getDescription.bind(this);
        this.getEstimatedValue = this.getEstimatedValue.bind(this);
        this.getUserId = this.getUserId.bind(this);
        this.getStatus = this.getStatus.bind(this);
        this.getName = this.getName.bind(this);
        this.getUploadDate = this.getUploadDate.bind(this);
        this.setStatus = this.setStatus.bind(this);
        this.getItemImages = this.getItemImages.bind(this);
        this.getCategory = this.getCategory.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.getPrimaryImage = this.getPrimaryImage.bind(this);
    }

    getId(){
        return this.#id;
    }
    getDescription(){
        return this.#description;
    }
    getEstimatedValue(){
        return this.#estimated_value;
    }
    getUserId(){
        return this.#user_id;
    }
    getStatus(){
        return this.#status;
    }
    getName(){
        return this.#name;
    }
    getUploadDate(){
        return this.#upload_date;
    }
    getCategory(){
        return this.#category;
    }

    setStatus(status){
        this.#status = status;
    }

    getItemImages(){
        return this.#item_images;
    }

    getPrimaryImage(){
        return this.#item_images.find(img => img.is_primary)?.url;
    }
    
     setCategory(category){
        this.#category = category;
     }
}
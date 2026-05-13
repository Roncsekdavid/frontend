export default class User {
  #id;
  #name;
  #email;
  #phone;
  #auth_user_id;
  #role;
  #register_date;
  #avatar_path;
  #avatar_url;

  constructor(
    id,
    name,
    email,
    phone,
    auth_user_id,
    role,
    register_date,
    avatar_path,
    avatar_url,
  ) {
    this.#id = id;
    this.#name = name;
    this.#email = email;
    this.#phone = phone;
    this.#auth_user_id = auth_user_id;
    this.#role = role;
    this.#register_date = register_date;
    this.#avatar_path = avatar_path;
    this.#avatar_url = avatar_url;

    this.getId = this.getId.bind(this);
    this.getName = this.getName.bind(this);
    this.getEmail = this.getEmail.bind(this);
    this.getPhone = this.getPhone.bind(this);
    this.getAuthUserId = this.getAuthUserId.bind(this);
    this.getRole = this.getRole.bind(this);
    this.getRegisterDate = this.getRegisterDate.bind(this);
    this.setName = this.setName.bind(this);
    this.setPhone = this.setPhone.bind(this);
  }

  getId() {
    return this.#id;
  }
  getName() {
    return this.#name;
  }
  getEmail() {
    return this.#email;
  }
  getPhone() {
    return this.#phone;
  }
  getAuthUserId() {
    return this.#auth_user_id;
  }
  getRole() {
    return this.#role;
  }
  getRegisterDate() {
    return this.#register_date;
  }
  setName(name) {
    this.#name = name;
  }
  setPhone(phone) {
    this.#phone = phone;
  }

  getAvatarPath() {
    return this.#avatar_path;
  }

  setAvatarPath(avatar) {
    this.#avatar_path = this.avatar;
  }

  getAvatarUrl() {
    return this.#avatar_url;
  }

  setAvatarUrl(url) {
    this.#avatar_url = url;
  }

  static fromApi(data) {
    return new User(
      data.id,
      data.name,
      data.email,
      data.phone,
      data.auth_user_id,
      data.role,
      data.register_date,
      data.avatar_path,
      data.avatar_url,
    );
  }
}

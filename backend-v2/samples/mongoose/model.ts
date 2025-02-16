import mongoose from 'mongoose';
import loadedAt from '../../internal/plugins/loadedAt';
// import bcrypt from 'bcrypt';
import { timeStampPlugin } from './plugin/timestamp';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: {type: String, required: false}
});
// const saltRounds = 10
userSchema.plugin(loadedAt);
userSchema.pre('save', function (next) {
  console.log('Pre save');
  console.log(this);
  // this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});
userSchema.plugin(timeStampPlugin)
const User = mongoose.model('User', userSchema);

export default User;

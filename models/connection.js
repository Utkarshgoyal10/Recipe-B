const mongoose = require("mongoose");

// mongoose.set("useNewUrlParser", true);
// mongoose.set("useFindAndModify", false);
// mongoose.set("useCreateIndex", true);
// mongoose.set("useUnifiedTopology", true);
main();
async function main() {
  try {
      await mongoose.connect(process.env.MONGO_URI)
      console.log('Connected to MongoDB');
      // Your other code here
  } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
  }
}
mongoose.connection.once("open", () => true).on("error", () => false);

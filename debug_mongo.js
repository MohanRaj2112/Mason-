require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');

console.log('MONGO_URI:', process.env.MONGO_URI ? 'Found ✓' : 'MISSING ✗');
console.log('Connecting...');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB ✓');
    console.log('DB Name:', mongoose.connection.db.databaseName);

    // Test insert
    const TestSchema = new mongoose.Schema({ name: String, ts: Date });
    const Test = mongoose.model('Test', TestSchema);
    
    try {
      const doc = new Test({ name: 'debug-test', ts: new Date() });
      await doc.save();
      console.log('Insert OK ✓ — ID:', doc._id);

      const all = await Test.find();
      console.log('Find OK ✓ — records:', all.length);
    } catch (e) {
      console.error('DB Operation Error:', e.message);
    }
    
    await mongoose.disconnect();
    console.log('Done.');
  })
  .catch(err => {
    console.error('Connection Error:', err.message);
  });

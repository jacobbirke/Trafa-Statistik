import mongoose from 'mongoose';

const chartConfigSchema = new mongoose.Schema({
  config: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now, expires: '365d' } 
});

export default mongoose.model('ChartConfig', chartConfigSchema);
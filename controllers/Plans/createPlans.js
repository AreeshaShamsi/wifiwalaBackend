import Plan from "../../models/Plan.js";


const createPlan = async (req, res) => {
  try {
    const { providerName, speed, price, validity, data } = req.body;

    if (!providerName || !speed || !price || !validity || !data) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const plan = await Plan.create({ providerName, speed, price, validity, data });

    res.status(201).json({
      success: true,
      message: 'Plan created successfully',
      plan
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export default createPlan;

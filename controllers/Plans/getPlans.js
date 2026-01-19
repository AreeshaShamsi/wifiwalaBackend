import Plan from "../../models/Plan.js";


const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find(); // fetch all plans
    res.json({
      success: true,
      message: 'Plans fetched successfully',
      plans
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export default getPlans;

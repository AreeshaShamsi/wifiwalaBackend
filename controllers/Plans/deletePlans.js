import Plan from "../../models/Plan.js";


const deletePlan = async (req, res) => {
  try {
    const { id } = req.params; // get plan id from URL

    const deletedPlan = await Plan.findByIdAndDelete(id);

    if (!deletedPlan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    res.json({
      success: true,
      message: 'Plan deleted successfully',
      plan: deletedPlan
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export default deletePlan;

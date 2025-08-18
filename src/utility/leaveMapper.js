export const mapApiToLeaveForm = (apiData) => {
  const mapped = {};
  for (const item of apiData) {
    const key = getLeaveKeyFromType(item.leave_type);
    if (key) {
      mapped[key] = {
        available: item.leave_remaing,
        booked: item.leave_used,
        total: item.leave_count,
        id: item.id,
        original_available: item.leave_remaing,
      };
    }
  }
  return mapped;
};

export const mapLeaveFormToDeltaPayload = (leaveInfo) => {
  return leaveInfo?.map((item) => ({
    id: item.id,
    leave_balance_to_add: item?.addon,
    leave_balance_to_subtract: item?.subst,
  }));
};

const getLeaveKeyFromType = (type) => {
  const lower = type.toLowerCase();
  if (lower.includes("sick")) return "sick";
  if (lower.includes("casual")) return "casual";
  if (lower.includes("earned")) return "earned";
  if (lower.includes("paternity")) return "paternity";
  if (lower.includes("sabbatical")) return "sabbatical";
  if (lower.includes("lop") || lower.includes("without")) return "lop";
  return null;
};

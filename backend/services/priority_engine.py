def calculate_priority(email, category):

    vip_users = {
        "ceo@company.com": True,
        "director@company.com": True
    }

    is_vip = email in vip_users

    if is_vip:
        if category in [
            "Security",
            "Data Loss"
        ]:
            return "CRITICAL"

        return "HIGH"

    if category in [
        "Security",
        "Data Loss"
    ]:
        return "HIGH"

    return "LOW"
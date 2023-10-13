export const errorStatusCodes = {
    1: "Missing input parameter",
    2: "Illegal parameter",
    3: "Entity already exists",
    9: "User exists with different type",
    10: "User not authorized",
}

export interface StatusCodesResponse {
    status: keyof typeof errorStatusCodes; // ! or 0!!
};
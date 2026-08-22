export enum ROLE {
        admin = "admin",
        user = "user",
        guest = "guest",
        manager = "manager"
    };

export enum Permission {
        READ_ORDER = "read:order",
        WRITE_ORDER = "write:order",
        UPDATE_ORDER = "update:order",
        DELETE_ORDER = "delete:order",
        READ_USER = "read:user",
        WRITE_USER = "write:user",
        UPDATE_USER = "update:user",
        DELETE_USER = "delete:user",
        AUTH_LOGIN = "auth:login",
        AUTH_LOGOUT = "auth:logout",
        READ_PRODUCT ="read:product",
        WRITE_PRODUCT ="write:product",
        UPDATE_PRODUCT ="update:product",
        DELETE_PRODUCT ="delete:product",
        READ_COLLECTION ="read:collection",
        WRITE_COLLECTION ="write:collection",
        UPDATE_COLLECTION ="update:collection",
        DELETE_COLLECTION ="delete:collection",
        WRITE_SALE ="write:sale",
        DELETE_SALE ="delete:sale"
        
    }
type RolePermission = {
         [key in ROLE]: Permission[]
    }


     export const rolePermission: RolePermission = {
        [ROLE.admin]: [
            ...Object.values(Permission),
        ],
        [ROLE.user]: [
            Permission.WRITE_ORDER,
            Permission.READ_USER,
            Permission.UPDATE_USER,
            Permission.DELETE_USER,
            Permission.READ_PRODUCT,
            Permission.READ_COLLECTION,
        ],
        [ROLE.guest]: [
            Permission.WRITE_USER,
            Permission.READ_ORDER,
            Permission.AUTH_LOGIN,
            Permission.READ_PRODUCT,
            Permission.READ_COLLECTION
        ],
        [ROLE.manager]: [
            Permission.READ_ORDER,
            Permission.WRITE_ORDER,
            Permission.UPDATE_ORDER,
            Permission.DELETE_ORDER,
            Permission.READ_USER,
            Permission.READ_COLLECTION,
            Permission.READ_PRODUCT,
            Permission.WRITE_PRODUCT,
            Permission.WRITE_COLLECTION,
            Permission.UPDATE_COLLECTION,
            Permission.UPDATE_PRODUCT,
            Permission.DELETE_COLLECTION,
            Permission.DELETE_PRODUCT,
            Permission.WRITE_SALE,
            Permission.DELETE_SALE
        ]
    }
export const toRole = (role: string): ROLE => {
    switch (role) {
        case ROLE.admin:
            return ROLE.admin;
        case ROLE.user:
            return ROLE.user;
        case ROLE.guest:
            return ROLE.guest;
        case ROLE.manager:
            return ROLE.manager;
        default:
            throw new Error(`Invalid role: ${role}`);
    }
}
export enum BookStatus {
    ALL = 'all',
    AVAILABLE = 'available',
    BORROWED = 'borrowed',
    RESERVED = 'reserved',
    RETURN = 'return',
    UNAVAILABLE = 'unavailable'
}

export enum BookAction {
    BORROW = 'borrow',
    RESERVE = 'reserve',
    CANCEL = 'cancel',
    RETURN = 'return'
}
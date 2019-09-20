/**
 * models if and how a column is supposed to be sorted
 */
export class SortState {
    direction: SortDirection = SortDirection.DESC;
    sorting = false;
}

/**
 * direction of the sorting of a column in a ResultSet
 */
export enum SortDirection {

    /**
     * ascending
     */
    ASC='ASC',

    /**
     * descending
     */
    DESC='DESC'
}

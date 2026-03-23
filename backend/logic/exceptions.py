class ItemAlreadyExistsError(Exception):
    """Raised when attempting to add an item that already exists in the wishlist."""
    pass

class ItemNotFoundError(Exception):
    """Raised when a wishlist item does not exist."""
    pass

class UpdateFailedError(Exception):
    """Raised when updating a wishlist item fails."""
    pass

class FailedToAddItemError(Exception):
    """Raised when adding a wishlist item fails."""
    pass
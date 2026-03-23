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

class FailedToRegisterError(Exception):
    """Raised when user registration fails."""
    pass

class UserAlreadyExistsError(Exception):
    """Raised when attempting to register a user that already exists."""
    pass 

class UserNotFoundError(Exception):
    """Raised when a user is not found."""
    pass

class InvalidCredentialsError(Exception):
    """Raised when user login fails due to invalid credentials."""
    pass
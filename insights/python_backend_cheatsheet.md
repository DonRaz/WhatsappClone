# Python Backend Interview Syntax Cheatsheet

## Classes and Objects

### Basic Class with __init__
```python
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email
        self._private_attr = "private"  # Convention for private
    
    def get_info(self):
        return f"{self.name} - {self.email}"
    
    def __str__(self):
        return f"User({self.name})"
    
    def __repr__(self):
        return f"User(name='{self.name}', email='{self.email}')"

# Usage
user = User("John", "john@email.com")
print(user.get_info())
```

### Class with Properties
```python
class Product:
    def __init__(self, name, price):
        self._name = name
        self._price = price
    
    @property
    def price(self):
        return self._price
    
    @price.setter
    def price(self, value):
        if value < 0:
            raise ValueError("Price cannot be negative")
        self._price = value
    
    @property
    def name(self):
        return self._name
```

## Inheritance

### Basic Inheritance
```python
class Animal:
    def __init__(self, name, species):
        self.name = name
        self.species = species
    
    def speak(self):
        return "Some sound"
    
    def info(self):
        return f"{self.name} is a {self.species}"

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name, "Dog")  # Call parent constructor
        self.breed = breed
    
    def speak(self):  # Override parent method
        return "Woof!"
    
    def fetch(self):  # New method specific to Dog
        return f"{self.name} is fetching"

# Usage
dog = Dog("Buddy", "Golden Retriever")
print(dog.speak())  # "Woof!"
print(dog.info())   # "Buddy is a Dog"
```

### Multiple Inheritance
```python
class Flyable:
    def fly(self):
        return "Flying high"

class Swimmable:
    def swim(self):
        return "Swimming fast"

class Duck(Animal, Flyable, Swimmable):
    def __init__(self, name):
        super().__init__(name, "Duck")
    
    def speak(self):
        return "Quack!"

duck = Duck("Donald")
print(duck.fly())    # "Flying high"
print(duck.swim())   # "Swimming fast"
```

## Common Data Structures

### Lists
```python
# Creation and basic operations
numbers = [1, 2, 3, 4, 5]
numbers.append(6)
numbers.extend([7, 8])
numbers.insert(0, 0)
popped = numbers.pop()
numbers.remove(3)

# List comprehensions
squares = [x**2 for x in range(10)]
evens = [x for x in numbers if x % 2 == 0]
```

### Dictionaries
```python
# Creation and basic operations
user_data = {
    "name": "John",
    "age": 30,
    "email": "john@email.com"
}

# Safe access
name = user_data.get("name", "Unknown")
age = user_data.setdefault("age", 0)

# Dictionary comprehension
squared_dict = {x: x**2 for x in range(5)}
filtered_dict = {k: v for k, v in user_data.items() if len(str(v)) > 3}
```

### Sets
```python
# Creation and operations
tags = {"python", "backend", "api"}
tags.add("web")
tags.update(["database", "redis"])
tags.discard("api")  # Safe removal (no error if not found)

# Set operations
set1 = {1, 2, 3, 4}
set2 = {3, 4, 5, 6}
intersection = set1 & set2  # {3, 4}
union = set1 | set2         # {1, 2, 3, 4, 5, 6}
difference = set1 - set2    # {1, 2}
```

## Common Algorithms

### Quick Sort
```python
def quicksort(arr):
    """
    Simple quicksort implementation
    Time: O(n log n) average, O(n²) worst case
    Space: O(log n) average due to recursion
    """
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]  # Choose middle element as pivot
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]  # Handle duplicates
    right = [x for x in arr if x > pivot]
    
    return quicksort(left) + middle + quicksort(right)

# Usage
numbers = [3, 6, 8, 10, 1, 2, 1]
sorted_numbers = quicksort(numbers)
print(sorted_numbers)  # [1, 1, 2, 3, 6, 8, 10]

# In-place version (more memory efficient)
def quicksort_inplace(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        pivot_index = partition(arr, low, high)
        quicksort_inplace(arr, low, pivot_index - 1)
        quicksort_inplace(arr, pivot_index + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1
```

## Functions and Decorators

### Function Basics
```python
def calculate_total(items, tax_rate=0.08):
    """Calculate total with tax"""
    subtotal = sum(items)
    tax = subtotal * tax_rate
    return subtotal + tax

# Args and kwargs
def flexible_function(*args, **kwargs):
    print(f"Args: {args}")
    print(f"Kwargs: {kwargs}")

flexible_function(1, 2, 3, name="John", age=30)
```

### Decorators
```python
from functools import wraps
import time

def timer_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__} took {end_time - start_time:.4f} seconds")
        return result
    return wrapper

@timer_decorator
def slow_function():
    time.sleep(1)
    return "Done"

# Class-based decorator
class RateLimiter:
    def __init__(self, max_calls=5):
        self.max_calls = max_calls
        self.calls = 0
    
    def __call__(self, func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if self.calls >= self.max_calls:
                raise Exception("Rate limit exceeded")
            self.calls += 1
            return func(*args, **kwargs)
        return wrapper
```

## Error Handling

### Try-Except Blocks
```python
def safe_divide(a, b):
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        print("Cannot divide by zero!")
        return None
    except TypeError as e:
        print(f"Type error: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None
    finally:
        print("Cleanup code here")

# Custom exceptions
class ValidationError(Exception):
    def __init__(self, message, field=None):
        super().__init__(message)
        self.field = field

def validate_email(email):
    if "@" not in email:
        raise ValidationError("Invalid email format", field="email")
```

## Context Managers

### File Operations
```python
# Basic file operations
with open("data.txt", "r") as file:
    content = file.read()

# Custom context manager
class DatabaseConnection:
    def __enter__(self):
        print("Opening database connection")
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Closing database connection")
        if exc_type:
            print(f"Exception occurred: {exc_val}")
        return False  # Don't suppress exceptions

with DatabaseConnection() as db:
    print("Using database")
```

## Generators and Iterators

### Generators
```python
def fibonacci_generator(n):
    a, b = 0, 1
    count = 0
    while count < n:
        yield a
        a, b = b, a + b
        count += 1

# Generator expression
squares_gen = (x**2 for x in range(1000))  # Memory efficient

# Custom iterator
class NumberIterator:
    def __init__(self, max_num):
        self.max_num = max_num
        self.current = 0
    
    def __iter__(self):
        return self
    
    def __next__(self):
        if self.current < self.max_num:
            self.current += 1
            return self.current
        raise StopIteration
```

## Common Backend Patterns

### Singleton Pattern
```python
class DatabaseManager:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not hasattr(self, 'initialized'):
            self.connections = {}
            self.initialized = True
```

### Factory Pattern
```python
class AnimalFactory:
    @staticmethod
    def create_animal(animal_type, name):
        if animal_type.lower() == "dog":
            return Dog(name, "Mixed")
        elif animal_type.lower() == "cat":
            return Cat(name)
        else:
            raise ValueError(f"Unknown animal type: {animal_type}")
```

### Data Validation
```python
from typing import List, Dict, Optional, Union
from dataclasses import dataclass

@dataclass
class UserRequest:
    name: str
    email: str
    age: Optional[int] = None
    tags: List[str] = None
    
    def __post_init__(self):
        if self.tags is None:
            self.tags = []

# Type hints for functions
def process_users(users: List[Dict[str, Union[str, int]]]) -> List[UserRequest]:
    return [UserRequest(**user) for user in users]
```

## Common Built-in Functions

### Useful Built-ins
```python
# Map, filter, reduce
from functools import reduce

numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, numbers))
evens = list(filter(lambda x: x % 2 == 0, numbers))
total = reduce(lambda x, y: x + y, numbers)

# Zip and enumerate
names = ["Alice", "Bob", "Charlie"]
ages = [25, 30, 35]
paired = list(zip(names, ages))

for index, name in enumerate(names):
    print(f"{index}: {name}")

# Sorting
data = [{"name": "Alice", "age": 25}, {"name": "Bob", "age": 30}]
sorted_by_age = sorted(data, key=lambda x: x["age"])
```

## Quick Tips for Interviews

1. **Always handle edge cases** (empty lists, None values, etc.)
2. **Use type hints** when possible
3. **Follow PEP 8** naming conventions
4. **Use list/dict comprehensions** for simple transformations
5. **Remember `is` vs `==`**: `is` for identity, `==` for equality
6. **Common gotcha**: Mutable default arguments
```python
# Wrong
def add_item(item, target_list=[]):  # Don't do this!
    target_list.append(item)
    return target_list

# Right  
def add_item(item, target_list=None):
    if target_list is None:
        target_list = []
    target_list.append(item)
    return target_list
```

Good luck with your interview! 🚀
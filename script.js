const itemform = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const items = itemList.querySelectorAll('li');
const formBtn = itemform.querySelector('button');
let isEditMode = false;

// localStorage doesnot expire while sessionStorage expires whenever the page reloads.
// We dont want to store any sensitive data inside the localStorage
// localStorage.setItem('name', 'Brad');
// console.log(localStorage.getItem('name'));
// localStorage.removeItem('name');
// localStorage.clear();

// Implementing localStorage in our project

function displayItems() {
  const itemFromStorage = getItemFromStorage();
  itemFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}

function onAddItemSubmit(e) {
  e.preventDefault();
  const newItem = itemInput.value;
  // validate input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  // Check for the edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert('Item already exists');
      return;
    }
  }
  // Create item DOM element
  addItemToDOM(newItem);

  // Add item to local storage
  addItemToStorage(newItem);

  checkUI();
  itemInput.value = '';

}

function addItemToDOM(item) {
  // create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  // Add li to the DOM
  itemList.appendChild(li);
}


function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function addItemToStorage(item) {
  let itemFromStorage = getItemFromStorage();

  if (localStorage.getItem('items') === null) {
    itemFromStorage = [];
  } else {
    itemFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  // Add item to array
  itemFromStorage.push(item);

  // Convert to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemFromStorage))
}

function getItemFromStorage() {
  let itemFromStorage;

  if (localStorage.getItem('items') === null) {
    itemFromStorage = [];
  } else {
    itemFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemFromStorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemFromStorage();
  return itemsFromStorage.includes(item);
  // if (itemsFromStorage.includes(item)) {
  //   return true;
  // } else {
  //   return false;
  // }
}

function setItemToEdit(item) {
  isEditMode = true;

  itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));
  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update item';
  formBtn.style.backgroundColor = '#228B22'
  itemInput.value = item.textContent;
}

function removeItem(item) {
  if (confirm('Are you sure want to remove item?')) {
    // Remove item from the DOM
    item.remove();

    // Remove item from the storage
    removeItemFromStorage(item.textContent);

    checkUI();
  }
}

function removeItemFromStorage(item) {
  let itemFromStorage = getItemFromStorage();
  // Filter out item to be removed
  itemFromStorage = itemFromStorage.filter((i) => i !== item);

  // Re-set to local storage
  localStorage.setItem('items', JSON.stringify(itemFromStorage));
}

function clearItems() {
  if (confirm('Clear the cart?')) {
    while (itemList.firstChild) {
      itemList.removeChild(itemList.firstChild);
    }

    // Clear from the local Storage
    localStorage.removeItem('items');
    checkUI();
  }

  checkUI();
}

function filterItems(e) {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  items.forEach(item => {
    const itemName = item.firstChild.textContent.toLocaleLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none'
    }
  })
}

function checkUI() {
  itemInput.value = '';
  const items = itemList.querySelectorAll('li');
  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';
  isEditMode = false;
}

// Initialize app
function init() {
  itemform.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  checkUI();

}

init();
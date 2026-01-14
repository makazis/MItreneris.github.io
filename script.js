// Image data - in a real application, this would come from a backend or file system
const imageData = [
    {
        id: 1,
        url: "https://images.unsplash.com/photo-1682687982502-1529b3b33f85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        title: "Mountain Landscape",
        description: "A beautiful mountain landscape with trees and clear sky"
    },
    {
        id: 2,
        url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        title: "Forest Path",
        description: "A winding path through a dense green forest"
    },
    {
        id: 3,
        url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1274&q=80",
        title: "Misty Mountains",
        description: "Mountain range covered in morning mist"
    },
    {
        id: 4,
        url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1275&q=80",
        title: "Autumn Forest",
        description: "Colorful autumn trees in a forest"
    },
    {
        id: 5,
        url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1276&q=80",
        title: "Woodland Stream",
        description: "A small stream running through a woodland area"
    }
];

// Predefined tags organized by category
const tagsByCategory = {
    nature: [
        "Tree", "Forest", "Mountain", "River", "Lake", "Flowers", "Grass", 
        "Sky", "Clouds", "Sun", "Rock", "Water", "Leaves", "Branch", "Path"
    ],
    structures: [
        "Building", "House", "Bridge", "Road", "Fence", "Window", "Door",
        "Wall", "Roof", "Steps", "Bench", "Lamp", "Sign", "Vehicle", "Boat"
    ],
    people: [
        "Person", "Face", "Hand", "Child", "Adult", "Walking", "Running",
        "Sitting", "Standing", "Group", "Crowd", "Sports", "Working", "Playing"
    ],
    weather: [
        "Sunny", "Cloudy", "Rainy", "Snow", "Fog", "Mist", "Windy", 
        "Storm", "Lightning", "Rainbow", "Clear", "Overcast", "Drizzle"
    ]
};

// Application state
let currentImageIndex = 0;
let selectedTags = {};
let customTags = [];
let tagData = {}; // Will store tags for each image

// DOM Elements
const displayedImage = document.getElementById('displayed-image');
const imageTitle = document.getElementById('image-title');
const imageDescription = document.getElementById('image-description');
const currentImageSpan = document.getElementById('current-image');
const totalImagesSpan = document.getElementById('total-images');
const selectedCountSpan = document.getElementById('selected-count');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const saveBtn = document.getElementById('save-btn');
const clearBtn = document.getElementById('clear-btn');
const natureTagsContainer = document.getElementById('nature-tags');
const structureTagsContainer = document.getElementById('structure-tags');
const peopleTagsContainer = document.getElementById('people-tags');
const weatherTagsContainer = document.getElementById('weather-tags');
const customTagInput = document.getElementById('custom-tag-input');
const addTagBtn = document.getElementById('add-tag-btn');
const customTagsContainer = document.getElementById('custom-tags-container');
const storageBar = document.getElementById('storage-bar');
const storageText = document.getElementById('storage-text');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');
const clearAllBtn = document.getElementById('clear-all-btn');
const dataModal = document.getElementById('data-modal');
const modalTitle = document.getElementById('modal-title');
const dataTextarea = document.getElementById('data-textarea');
const copyBtn = document.getElementById('copy-btn');
const closeModal = document.getElementById('close-modal');

// Initialize the application
function init() {
    // Set total images count
    totalImagesSpan.textContent = imageData.length;
    
    // Load saved data from localStorage
    loadFromLocalStorage();
    
    // Initialize tag checkboxes
    initializeTags();
    
    // Load the first image
    loadImage(currentImageIndex);
    
    // Update UI based on current state
    updateUI();
    
    // Set up event listeners
    setupEventListeners();
}

// Load image data and tags for the specified index
function loadImage(index) {
    if (index < 0 || index >= imageData.length) return;
    
    currentImageIndex = index;
    const image = imageData[index];
    
    // Update image display
    displayedImage.src = image.url;
    displayedImage.alt = image.title;
    imageTitle.textContent = image.title;
    imageDescription.textContent = image.description;
    currentImageSpan.textContent = index + 1;
    
    // Load tags for this image
    loadTagsForCurrentImage();
    
    // Update UI
    updateUI();
}

// Initialize tag checkboxes
function initializeTags() {
    // Clear existing tags
    natureTagsContainer.innerHTML = '';
    structureTagsContainer.innerHTML = '';
    peopleTagsContainer.innerHTML = '';
    weatherTagsContainer.innerHTML = '';
    
    // Create checkboxes for each tag category
    createTagCheckboxes(tagsByCategory.nature, natureTagsContainer);
    createTagCheckboxes(tagsByCategory.structures, structureTagsContainer);
    createTagCheckboxes(tagsByCategory.people, peopleTagsContainer);
    createTagCheckboxes(tagsByCategory.weather, weatherTagsContainer);
    
    // Load custom tags
    loadCustomTags();
}

// Create checkbox elements for tags
function createTagCheckboxes(tags, container) {
    tags.forEach(tag => {
        const tagId = `tag-${tag.toLowerCase().replace(/\s+/g, '-')}`;
        
        const tagItem = document.createElement('div');
        tagItem.className = 'tag-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = tagId;
        checkbox.className = 'tag-checkbox';
        checkbox.value = tag;
        
        const label = document.createElement('label');
        label.htmlFor = tagId;
        label.className = 'tag-label';
        label.textContent = tag;
        
        tagItem.appendChild(checkbox);
        tagItem.appendChild(label);
        container.appendChild(tagItem);
        
        // Add event listener to update selected tags
        checkbox.addEventListener('change', function() {
            updateSelectedTags(tag, this.checked);
            updateSelectedCount();
            saveTagsForCurrentImage();
        });
    });
}

// Load custom tags from storage and display them
function loadCustomTags() {
    customTagsContainer.innerHTML = '';
    
    if (customTags.length === 0) {
        return;
    }
    
    customTags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'custom-tag-item';
        tagElement.innerHTML = `
            ${tag}
            <button class="remove-tag" data-tag="${tag}">&times;</button>
        `;
        customTagsContainer.appendChild(tagElement);
        
        // Add event listener to remove button
        const removeBtn = tagElement.querySelector('.remove-tag');
        removeBtn.addEventListener('click', function() {
            removeCustomTag(tag);
        });
    });
}

// Add a custom tag
function addCustomTag() {
    const tag = customTagInput.value.trim();
    
    if (tag === '') {
        alert('Please enter a tag name');
        return;
    }
    
    // Check if tag already exists (case insensitive)
    const tagLower = tag.toLowerCase();
    const allTags = [
        ...tagsByCategory.nature,
        ...tagsByCategory.structures,
        ...tagsByCategory.people,
        ...tagsByCategory.weather
    ].map(t => t.toLowerCase());
    
    if (allTags.includes(tagLower) || customTags.map(t => t.toLowerCase()).includes(tagLower)) {
        alert('This tag already exists!');
        customTagInput.value = '';
        return;
    }
    
    // Add to custom tags array
    customTags.push(tag);
    
    // Create a checkbox for the new tag
    const customCategory = document.querySelector('.custom-tags-list');
    if (!customCategory) return;
    
    // Save custom tags to localStorage
    saveCustomTags();
    
    // Reload custom tags display
    loadCustomTags();
    
    // Clear input
    customTagInput.value = '';
}

// Remove a custom tag
function removeCustomTag(tag) {
    customTags = customTags.filter(t => t !== tag);
    saveCustomTags();
    loadCustomTags();
    
    // Also remove from selected tags for all images
    const imageId = imageData[currentImageIndex].id;
    if (tagData[imageId] && tagData[imageId].includes(tag)) {
        tagData[imageId] = tagData[imageId].filter(t => t !== tag);
        saveToLocalStorage();
        loadTagsForCurrentImage();
        updateSelectedCount();
    }
}

// Update selected tags object
function updateSelectedTags(tag, isSelected) {
    if (isSelected) {
        if (!selectedTags[tag]) {
            selectedTags[tag] = true;
        }
    } else {
        delete selectedTags[tag];
    }
}

// Update the selected tags count display
function updateSelectedCount() {
    const count = Object.keys(selectedTags).length;
    selectedCountSpan.textContent = count;
}

// Load tags for the current image
function loadTagsForCurrentImage() {
    // Clear selected tags
    selectedTags = {};
    
    // Reset all checkboxes
    document.querySelectorAll('.tag-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Get image ID
    const imageId = imageData[currentImageIndex].id;
    
    // Load tags for this image from tagData
    if (tagData[imageId] && tagData[imageId].length > 0) {
        tagData[imageId].forEach(tag => {
            selectedTags[tag] = true;
            
            // Find and check the corresponding checkbox
            const checkbox = document.querySelector(`input[value="${tag}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }
    
    updateSelectedCount();
}

// Save tags for the current image
function saveTagsForCurrentImage() {
    const imageId = imageData[currentImageIndex].id;
    
    // Convert selectedTags object to array
    const tagsArray = Object.keys(selectedTags);
    
    // Save to tagData
    tagData[imageId] = tagsArray;
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Update storage display
    updateStorageDisplay();
}

// Clear tags for the current image
function clearCurrentImageTags() {
    selectedTags = {};
    
    // Uncheck all checkboxes
    document.querySelectorAll('.tag-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Clear tags in tagData
    const imageId = imageData[currentImageIndex].id;
    tagData[imageId] = [];
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Update UI
    updateSelectedCount();
    updateStorageDisplay();
}

// Update UI elements based on current state
function updateUI() {
    // Enable/disable navigation buttons
    prevBtn.disabled = currentImageIndex === 0;
    nextBtn.disabled = currentImageIndex === imageData.length - 1;
    
    // Update storage display
    updateStorageDisplay();
}

// Update storage information display
function updateStorageDisplay() {
    const totalImages = imageData.length;
    const taggedImages = Object.keys(tagData).length;
    const percentage = Math.round((taggedImages / totalImages) * 100);
    
    storageBar.style.width = `${percentage}%`;
    storageText.innerHTML = `Tags for <strong>${taggedImages}</strong> of ${totalImages} images saved locally`;
}

// Export tag data as JSON
function exportData() {
    const exportData = {
        images: imageData,
        tags: tagData,
        customTags: customTags,
        exportDate: new Date().toISOString()
    };
    
    dataTextarea.value = JSON.stringify(exportData, null, 2);
    modalTitle.textContent = 'Export Tagged Data';
    dataModal.style.display = 'flex';
}

// Import tag data from JSON
function importData() {
    modalTitle.textContent = 'Import Tag Data';
    dataTextarea.value = '';
    dataTextarea.placeholder = 'Paste your JSON data here...';
    dataModal.style.display = 'flex';
    
    // Change copy button to import button temporarily
    copyBtn.textContent = 'Import Data';
    copyBtn.onclick = processImport;
}

// Process imported data
function processImport() {
    try {
        const importedData = JSON.parse(dataTextarea.value);
        
        // Validate imported data structure
        if (!importedData.tags) {
            throw new Error('Invalid data format. Missing "tags" property.');
        }
        
        // Import tags
        tagData = importedData.tags;
        
        // Import custom tags if available
        if (importedData.customTags && Array.isArray(importedData.customTags)) {
            customTags = importedData.customTags;
            saveCustomTags();
            loadCustomTags();
        }
        
        // Save to localStorage
        saveToLocalStorage();
        
        // Reload current image tags
        loadTagsForCurrentImage();
        
        // Update UI
        updateStorageDisplay();
        
        // Show success message
        alert('Data imported successfully!');
        
        // Close modal
        dataModal.style.display = 'none';
        
        // Reset copy button
        copyBtn.textContent = 'Copy to Clipboard';
        copyBtn.onclick = copyToClipboard;
    } catch (error) {
        alert(`Error importing data: ${error.message}`);
    }
}

// Copy data to clipboard
function copyToClipboard() {
    dataTextarea.select();
    document.execCommand('copy');
    
    // Show feedback
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    copyBtn.style.backgroundColor = '#2ecc71';
    
    setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.backgroundColor = '';
    }, 2000);
}

// Clear all data from localStorage
function clearAllData() {
    if (confirm('Are you sure you want to clear all tag data? This cannot be undone.')) {
        localStorage.removeItem('imageTaggingData');
        localStorage.removeItem('imageTaggingCustomTags');
        
        // Reset application state
        tagData = {};
        customTags = [];
        selectedTags = {};
        
        // Reset UI
        loadTagsForCurrentImage();
        loadCustomTags();
        updateSelectedCount();
        updateStorageDisplay();
        
        alert('All data cleared successfully.');
    }
}

// Save data to localStorage
function saveToLocalStorage() {
    const saveData = {
        tagData: tagData,
        lastSaved: new Date().toISOString()
    };
    
    localStorage.setItem('imageTaggingData', JSON.stringify(saveData));
}

// Save custom tags to localStorage
function saveCustomTags() {
    localStorage.setItem('imageTaggingCustomTags', JSON.stringify(customTags));
}

// Load data from localStorage
function loadFromLocalStorage() {
    // Load tag data
    const savedData = localStorage.getItem('imageTaggingData');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            tagData = parsedData.tagData || {};
        } catch (e) {
            console.error('Error loading saved data:', e);
            tagData = {};
        }
    }
    
    // Load custom tags
    const savedCustomTags = localStorage.getItem('imageTaggingCustomTags');
    if (savedCustomTags) {
        try {
            customTags = JSON.parse(savedCustomTags);
        } catch (e) {
            console.error('Error loading custom tags:', e);
            customTags = [];
        }
    }
}

// Set up event listeners
function setupEventListeners() {
    // Navigation buttons
    prevBtn.addEventListener('click', () => {
        if (currentImageIndex > 0) {
            loadImage(currentImageIndex - 1);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentImageIndex < imageData.length - 1) {
            loadImage(currentImageIndex + 1);
        }
    });
    
    // Save and clear buttons
    saveBtn.addEventListener('click', saveTagsForCurrentImage);
    clearBtn.addEventListener('click', clearCurrentImageTags);
    
    // Custom tag button
    addTagBtn.addEventListener('click', addCustomTag);
    customTagInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addCustomTag();
        }
    });
    
    // Data management buttons
    exportBtn.addEventListener('click', exportData);
    importBtn.addEventListener('click', importData);
    clearAllBtn.addEventListener('click', clearAllData);
    
    // Modal buttons
    copyBtn.addEventListener('click', copyToClipboard);
    closeModal.addEventListener('click', () => {
        dataModal.style.display = 'none';
        // Reset copy button if it was changed for import
        copyBtn.textContent = 'Copy to Clipboard';
        copyBtn.onclick = copyToClipboard;
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === dataModal) {
            dataModal.style.display = 'none';
            // Reset copy button if it was changed for import
            copyBtn.textContent = 'Copy to Clipboard';
            copyBtn.onclick = copyToClipboard;
        }
    });
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', init);
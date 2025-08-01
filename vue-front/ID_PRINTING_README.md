# ID Printing Feature - Integrated Solution

This feature allows administrators to print student ID cards directly from the Enrolled Students page, providing a seamless workflow for managing student IDs.

## Location & Access

The ID printing functionality is integrated into the **Enrolled Students** page:
- **Navigation**: Enrollment → Enrolled Students
- **Direct URL**: `/enrollment/enrolled/student`

## Features

- **Integrated Workflow**: Print IDs directly from the student enrollment list
- **Student Selection**: Select multiple students using checkboxes in the data table
- **ID Preview**: Preview ID cards before printing with professional design
- **Batch Printing**: Print multiple student IDs in one operation
- **Professional Design**: Clean, school-appropriate ID card layout

## How to Use

### 1. Navigate to Enrolled Students
- Go to **Enrollment** → **Enrolled Students** from the sidebar menu
- The page displays all enrolled students with filtering and pagination

### 2. Select Students for ID Printing
- Use the checkboxes in the first column to select students
- You can select multiple students for batch printing
- Selected student count is displayed above the table

### 3. Preview or Print IDs
- Click **"Preview IDs"** to see how the ID cards will look
- Click **"Print IDs"** to open print preview and print
- Both buttons are only enabled when students are selected

### 4. Print Process
- The preview opens in a modal dialog
- Review the ID cards for accuracy
- Click **"Print IDs"** in the preview to open print dialog
- Use high-quality print settings for best results

## ID Card Information

Each ID card includes:
- **School Header**: School name, address, and school year
- **Student Photo**: Actual photo or attractive initial-based avatar
- **Student Details**:
  - Full name (First, Middle Initial, Last)
  - Student ID
  - LRN (Learner Reference Number)
  - Grade Level
  - Section
- **Principal Signature Line**: Space for official authorization

## Page Features

### Data Table Capabilities
- **Filtering**: Search by Student ID, LRN, Name, Grade, Gender, etc.
- **Sorting**: Sort by any column
- **Pagination**: Navigate through large student lists
- **Selection**: Multi-select with checkboxes for ID printing

### Visual Feedback
- Selection counter shows how many students are selected
- Buttons disabled when no students selected
- Toast notifications for user guidance

## Technical Implementation

### Components Used
- **EnrolledStudentListView.vue**: Main page with integrated ID printing
- **IDPreview.vue**: Reusable ID card preview component
- **DataTable**: PrimeVue table with selection support
- **Dialog**: Modal for ID preview

### Data Handling
- Supports enrollment data structure with nested student objects
- Handles both direct student objects and enrollment objects
- Flexible grade level and section mapping

### Print Specifications
- **Paper Size**: A4/Letter optimized
- **Layout**: 2 ID cards per row
- **Dimensions**: Standard ID card size (85mm x 54mm)
- **Quality**: High-resolution print ready

## Customization

### School Information
Edit the `schoolInfo` object in `IDPreview.vue`:
```javascript
const schoolInfo = ref({
  name: 'Your School Name',
  address: '123 School Street, City, Province',
  logo: '/path/to/school/logo.png',
  schoolYear: '2024-2025'
})
```

### ID Card Design
- Modify CSS in `IDPreview.vue` for styling changes
- Update colors, fonts, or layout as needed
- Adjust print dimensions in media queries

## Benefits of Integration

✅ **Streamlined Workflow**: No need to navigate to separate pages  
✅ **Context Awareness**: Print IDs for students you're already viewing  
✅ **Efficient Selection**: Use existing filters to find students quickly  
✅ **Batch Operations**: Select and print multiple IDs at once  
✅ **Consistent UX**: Maintains the existing page layout and functionality  

## User Experience

The integrated approach provides:
- **Familiar Interface**: Uses the existing student table layout
- **Quick Access**: ID printing buttons prominently displayed
- **Clear Feedback**: Visual indicators for selection and actions
- **Professional Output**: High-quality, printable ID cards

This integration makes ID printing a natural part of the student management workflow, reducing clicks and improving efficiency for school administrators.

# ForgeIQ Data Inventory

## 1. 252-Column Delivery Contract
- **File:** `Unihack_ Expected Output - Delivery Format.csv`
- **Location:** `ForgeIQ Engineering Package/`
- **Description:** Contains the expected headers for the 252 columns (e.g., MFR URL, Ref URL 1-5, PART_NUMBER, Dept, Class, Fine, SKU, Mfg_Part_Num, Part_Desc, E1_Brand, etc., ending with Actual Image (Yes/No)).

## 2. Input Dataset (Working Dataset & Ground Truth)
- **File:** `Unihack_ Sample Dataset - Input.csv`
- **Location:** `ForgeIQ Engineering Package/`
- **Description:** Contains the raw input product rows. The challenge specifies there is a 1,000-row working dataset and a 200-row ground truth. These need to be properly separated/identified based on criteria or files that we will load.

## 3. Reference Data
- **Documentation:** `docs/03_Complete_252_Column_Data_Dictionary.md`
- **Description:** The system must load reference data to support LOV, UOM, and Taxonomy classification as described in the documentation. (No separate LOV/Taxonomy files were present in the root package folder, so they are likely documented within the `.md` files or require extraction/fetching).

## 4. Other Files
- **Solution Guide:** `Solution Guide.pdf`
- **Presentation:** `UniHack-Protoype Template.pptx`
- **Images:** Several `.png` screenshots are present.

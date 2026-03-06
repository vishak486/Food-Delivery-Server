const Category=require('../models/categoryModel')

exports.createCategoryController=async(req,res)=>{
    console.log("Inside createCategoryController");
    const{name,description}=req.body
    try
    {
        const existingCategory=await Category.findOne({name})
        if(existingCategory)
        {
            return res.status(406).json("Category Already Exists")
        }
        const newCategory=new Category({
            name,description
        })
        await newCategory.save()
        res.status(200).json("Category Created Successfully")
    }
    catch(err)
    {
        res.status(500).json(err)
    }
}

exports.getAllCategoriesControllerForAdmin=async(req,res)=>{
    console.log("Inside getAllCategoriesControllerForAdmin");
    try
    {
        const AllCategories=await Category.find()
        res.status(200).json(AllCategories)
    }
    catch(err)
    {
        res.status(500).json(err)
    }   
}

exports.deActivateCategoryController=async(req,res)=>{
    console.log("Inside deActivateCategoryController");
    const{categoryId}=req.params
    try
    {
        const existingCategory=await Category.findById(categoryId)
        if(!existingCategory)
        {
            return res.status(404).json("Category not exist")
        }
        existingCategory.isActive=false
        await existingCategory.save()
        res.status(200).json("Category Deactivated")
    }
    catch(err)
    {
        res.status(500).json(err)
    }
}

exports.ActivateCategoryController=async(req,res)=>{
    console.log("Inside ActivateCategoryController");
    const{categoryId}=req.params
    try
    {
        const existingCategory=await Category.findById(categoryId)
        if(!existingCategory)
        {
            return res.status(404).json("Category not exist")
        }
        existingCategory.isActive=true
        await existingCategory.save()
        res.status(200).json("Category Activated")
    }
    catch(err)
    {
        res.status(500).json(err)
    }
}

exports.updateCategoryController=async(req,res)=>{
    console.log("Inside updateCategoryController");
    const {categoryId}=req.params
    const {name,description}=req.body
    try
    {
        const existingCategory=await Category.findById(categoryId)
        if (!existingCategory) {
            return res.status(404).json("Category not found")
        }
        const duplicateCategory=await Category.findOne({name})
        if(duplicateCategory && duplicateCategory._id.toString()!==categoryId)
        {
            return res.status(406).json("Category Name already exists!!")
        }
        existingCategory.name=name || existingCategory.name
        existingCategory.description=description || existingCategory.description

        await existingCategory.save()
        res.status(200).json("Category Updated Successfully")
    }
    catch(err)
    {
        res.status(500).json(err)
    }
    
}
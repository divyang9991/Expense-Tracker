import Money from "../model/money.js"

export const addExpense=async (req,res)=>{
     const {date,amount,category}=req.body;
     const userId=req.user._id;

     try {
        if(!userId){
            res.status(400).json({message:"no id "});
        }
        if(!date || !amount || !category){
            res.status(400).json({message:"all field required in adding expense"});
        }

        const newExpense=new Money({
           userId,date,amount,category,expenseType:"expense"
        });

        if(!newExpense){
            res.status(400).json({message:"Invalid data in adding expense"});
        }

        await newExpense.save();
        res.status(200).json(newExpense);
     } catch (error) {
        console.log("error in adding expense",error.message);
        res.status(500).json({message:"internal server error in adding expense"});
     }

}


export const addIncome=async (req,res)=>{
     const {date,amount,category}=req.body;
     const userId=req.user._id;
     try {
        if(!date || !amount || !category || !userId){
          return   res.status(400).json({message:"all field required in adding income"});
        }

        const newIncome=new Money({
            userId,date,amount,category,expenseType:"income"
        });

        if(!newIncome){
           return   res.status(400).json({message:"Invalid data in adding income"});
        }

        await newIncome.save();
       return  res.status(200).json(newIncome);
     } catch (error) {
        console.log("error in adding income",error.message);
        res.status(500).json({message:"internal server error in adding income"});
     }
}

export const deleteIncomeMoney=async(req,res)=>{
    const moneyId=req.params.id;
    try {
        const money=await Money.findByIdAndDelete(moneyId);
        if(!money){
            res.status(400).json({message:"could not delete it"});
        }
        res.status(200).json(money);
    } catch (error) {
        console.log("error in deleting the money instance");
        res.status(500).json({message:"internal server error in deleting money instance"});
    }
}

export const deleteExpenseMoney=async(req,res)=>{
    const moneyId=req.params.id;
    try {
        const money=await Money.findByIdAndDelete(moneyId);
        if(!money){
            res.status(400).json({message:"could not delete it"});
        }
        res.status(200).json(money);
    } catch (error) {
        console.log("error in deleting the money instance",error.message);
        res.status(500).json({message:"internal server error in deleting money instance"});
    }
}
export const getAllExpense=async(req,res)=>{
    try {
        const allExpense=await Money.find({userId:req.user._id,expenseType:'expense'});
        res.status(200).json(allExpense);
    } catch (error) {
        console.log("error getting all expense",error.message);
        res.status(500).json({message:"Internal server error in expense get"});
    }
}

export const getAllIncome=async(req,res)=>{
    try {
        const allIncome=await Money.find({userId:req.user._id,expenseType:'income'});
        res.status(200).json(allIncome);
    } catch (error) {
        console.log("error getting all income",error.message);
        res.status(500).json({message:"Internal server error in income get"});
    }
}

export const getRecent=async(req,res)=>{
    try {
        const recent=await Money.find({userId:req.user._id}).sort({date:-1});
        res.status(200).json(recent);
    } catch (error) {
        res.status(500).json({message:`error occured as ${error.message}`})
    }
}

export const getInfo=async(req,res)=>{
    try {
        const info=await Money.findOne({userId:req.user._id,_id:req.params.id});
        res.status(200).json(info);
    } catch (error) {
        res.status(500).json({message:"Error while getting money Info"});
    }
}
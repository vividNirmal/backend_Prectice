
export function pagination (module) {
    return (req,res,next)=>{
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);

        let startindex = (page - 1) * limit
        let endindex = page * limit
        const result = {}
        result.next ={
            page  : page + 1,
            limit : limit
        }
        result.previos ={
            page : page - 1,
            limit : limit
        }

        module.find({}).limit(limit).skip(startindex)
        next()
    }

}
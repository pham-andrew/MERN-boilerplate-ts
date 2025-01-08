const Obj = require('./obj.model')
const router = require('express').Router()
import express, { Request, Response } from "express";

router.route('/create').post((req: Request, res: Response) => {
    const newObj = new Obj(req.body)
    newObj.save().then((obj: typeof Obj) => res.json(obj))
})

router.get("/", async (req: Request, res: Response) => {
    const data = await Obj.find();
    res.send({ data: data });
});

router.delete("/", async (req: Request, res: Response) => {
    const deletedDocument = await Obj.deleteOne({_id: req.body.id,});
    res.send(deletedDocument);
});

router.patch("/", async (req: Request, res: Response) => {
    const result = await Obj.updateOne({ _id: req.body.id }, { $set: { text: req.body.text } });
    res.status(200).send({
        data: result,
    });
});

module.exports = router
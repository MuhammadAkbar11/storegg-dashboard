import { TransfromError } from "../../helpers/baseError.helper.js";
import PlayerModel from "./player.model.js";

export const findAllPlayer = async () => {
  try {
    const result = await PlayerModel.find({});
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findAllPlayer", error);
    throw new TransfromError(error);
  }
};

export const findOnePlayer = async filter => {
  try {
    const result = await PlayerModel.findOne({ ...filter }).select("-password");
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findOnePlayer", error);
    throw new TransfromError(error);
  }
};

export const findPlayerById = async id => {
  try {
    const result = await PlayerModel.findById(id);
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findOnePlayer", error);
    throw new TransfromError(error);
  }
};

export const createPlayer = async data => {
  try {
    const result = await PlayerModel.create({ ...data });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] createPlayer", error);
    throw new TransfromError(error);
  }
};

export const updatePlayer = async (id, data) => {
  try {
    const result = await BankModel.findByIdAndUpdate(id, data);
    return result;
  } catch (error) {
    console.error("[EXCEPTION] updatePlayer", error);
    throw new TransfromError(error);
  }
};

export const deletePlayerById = async id => {
  try {
    const result = await PlayerModel.deleteOne({ _id: id });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] deletePlayerById", error);
    throw new TransfromError(error);
  }
};

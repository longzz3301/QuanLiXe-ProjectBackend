import { v4 as uuidv4 } from 'uuid';
import { Obj } from '../global/interface';
const genrandomId = () => {
    return uuidv4()
};
const getProjection = (...fields: Array<string>) => {
    const filedsProjection: Obj = {};
    fields.forEach((item) => {
        filedsProjection[item] = 1
    });
    return filedsProjection
}
export { genrandomId, getProjection };
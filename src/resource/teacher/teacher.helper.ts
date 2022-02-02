import {Cache} from "cache-manager";
import { UpdateTeacherAvailableDto} from "../classes/dto/teacher-avaible.dto";
import {TEACHER_CACHE_TTL} from "./teacher.constant";

type TypeTeacherCacheSet = {
    cache: Cache,
    updateTeacherAvailableDto: UpdateTeacherAvailableDto
}
export const teacherCacheKey = (id: string): string => `teacher-${id}`;

export const teacherCacheSet = (props: TypeTeacherCacheSet): Promise<string> =>{
    return props.cache.set(
        teacherCacheKey(props.updateTeacherAvailableDto.teacherId),
        JSON.stringify({
            online: props.updateTeacherAvailableDto.online,
            available: props.updateTeacherAvailableDto.available,
        }), {
            ttl: TEACHER_CACHE_TTL,
        });
}
export const teacherCacheGet = (props: {
    cache: Cache,
    teacherId: string,
}): Promise<string> =>{
    return props.cache.get(teacherCacheKey(props.teacherId));
}
export const teacherCacheDelete = (props: {
    cache: Cache,
    teacherId: string,
}): Promise<string> =>{
    return props.cache.del(teacherCacheKey(props.teacherId));
}
export const teacherCacheClear = (props: {
    cache: Cache,
}): Promise<void> =>{
    return props.cache.reset();
}
export const handleTeacherInCache = async (props: TypeTeacherCacheSet): Promise<any> => {
    const {updateTeacherAvailableDto} = props;

    const hasOnline = {
        teacherId: updateTeacherAvailableDto.teacherId,
        message: 'Teacher is online now',
        status: 'success',
    }
    const hasOffline = {
        teacherId: updateTeacherAvailableDto.teacherId,
        message: 'Teacher is offline now',
        status: 'success',
    }

    if(!updateTeacherAvailableDto.online && !updateTeacherAvailableDto.available){
        return await teacherCacheDelete({
            cache: props.cache,
            teacherId: updateTeacherAvailableDto.teacherId,
        })
            .then(async() => Promise.resolve(hasOffline))
            .catch(async(err) => Promise.reject(new Error(err)));
    }

    const getTeacherInCache = await teacherCacheGet({
        cache: props.cache,
        teacherId: updateTeacherAvailableDto.teacherId,
    }).catch(async(err) => Promise.reject(new Error(err)));

    if(!getTeacherInCache){
        return await teacherCacheSet({
            cache: props.cache,
            updateTeacherAvailableDto,
        })
            .then(async() => Promise.resolve(hasOnline))
            .catch(async(err) => Promise.reject(new Error(err)));
    }

    const teacherInCache = JSON.parse(getTeacherInCache);

    if (teacherInCache.online !== updateTeacherAvailableDto.online) {
        await teacherCacheSet(props);
    }

    if (teacherInCache.available !== updateTeacherAvailableDto.available) {
        await teacherCacheSet(props);
    }

    return await teacherCacheGet({
        cache: props.cache,
        teacherId: updateTeacherAvailableDto.teacherId,
    }).then(async(teacher) => Promise.resolve(JSON.parse(teacher)))
        .catch(async(err) => Promise.reject(new Error(err)));
}
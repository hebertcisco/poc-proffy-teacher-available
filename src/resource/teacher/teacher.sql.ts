export class TeacherSql {
    public static findOne(id: string): string {
        return `
            SELECT t.id as id_teacher, t.id_user,
                   t.available, t.online, u.name as username
            FROM teacher AS t
                INNER  JOIN "user" u
                     ON u.id = t.id_user
            WHERE t.id = '${id}';
        `;
    }
    public static findClassesByTeacher(
        teacher_id: string,
    ): string {
        return `
            SELECT t.id as teacher_id,
                   cl.status as classes_status,
                   cl.id as classes_id,
                   st.id as student_id,
                   u.name as student_name,
                   u.email as student_email
            FROM teacher AS t
                     INNER JOIN classes cl ON cl."teacherId" = t.id
                     INNER JOIN student st ON st.id = cl."studentId"
                     INNER JOIN "user" u ON u.id = st.id_user
            WHERE t.id = '${teacher_id}';
        `;
    }
}

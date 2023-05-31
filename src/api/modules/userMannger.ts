import http from '@/api'
import type { User } from '@/global/user.d'

/**
 * 获取用户进出数据
 */
export const getUserInOutInfo = (
	params: User.ReqUserList,
	currentPage: number,
	pageSize: number
) => {
	return http.post<User.ResUserList>(
		`/access/getAccessRecord/${currentPage}/${pageSize}`,
		{
			params
		}
	)
}

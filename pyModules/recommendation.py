import numpy as np
from numpy.linalg import norm
from pyModules.Queries import Queries


class Recommendation:
    @staticmethod
    def rec_friends(get_con, uname, limit):
        cursor = get_con().cursor()
        fr_count = cursor.execute(Queries.getFriends(), uname)
        fr_lst = cursor.fetchall()

        cursor.execute(Queries.getAllOtherUserName(), uname)
        allUsers = cursor.fetchall()

        cursor.execute(Queries.getUserProfile(), uname)
        userProfile = cursor.fetchone()

        vec1 = Recommendation.__userToVec(userProfile)
        d = {}

        for user in allUsers:
            cursor.execute(Queries.getUserProfile(), user)
            profile = cursor.fetchone()
            cursor.execute(Queries.getFriends(), user)
            usr_fr_lst = cursor.fetchall()
            common_frs = len(set(fr_lst).intersection(set(usr_fr_lst)))
            vec2 = Recommendation.__userToVec(profile)

            np.append(vec1, fr_count)
            np.append(vec2, common_frs)

            similarity = np.dot(vec1, vec2) / (norm(vec1) * norm(vec2))
            d[user[0]] = similarity

        d = sorted(d.items(), key=lambda kv: kv[1], reverse=True)
        limit = limit if limit <= len(d) else len(d)
        cursor.close()

        return [pair[0] for pair in d[:limit]]

    @staticmethod
    def rec_roadmap(get_con, uname, limit):
        result = []
        cursor = get_con().cursor()
        cursor.execute(Queries.getFriends(), uname)
        fr_lst = cursor.fetchall()

        for fr in fr_lst:
            roadmap_ct = cursor.execute(Queries.getRoadMapForUser(), fr)
            if roadmap_ct != 0:
                roadmaps = cursor.fetchall()
                if len(result) + roadmap_ct <= limit:
                    result.extend(roadmaps)
                else:
                    result.extend(roadmaps[:limit - len(result)])
                    break
            else:
                continue

        if len(result) < limit:
            sameLevel_ct = cursor.execute(Queries.getUserWithSameLevel(), uname)
            sameLevels = cursor.fetchall()
            if sameLevel_ct != 0:
                for user in sameLevels:
                    roadmap_ct = cursor.execute(Queries.getRoadMapForUser(), user)
                    if roadmap_ct != 0:
                        roadmaps = cursor.fetchall()
                        if len(result) + roadmap_ct <= limit:
                            result.extend(roadmaps)
                        else:
                            result.extend(roadmaps[:limit - len(result)])
                            break
                    else:
                        continue

        return result

    @staticmethod
    def __userToVec(profile):
        return np.array(profile[5:], dtype=int)

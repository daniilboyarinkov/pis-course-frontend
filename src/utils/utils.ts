import {IUser, Position} from '../app/types';
import {
    ADMINISTRATOR_PERMISSIONS,
    BIBLIOGRAPHER_PERMISSIONS,
    LIBRARIAN_PERMISSIONS,
    READER_PERMISSIONS
} from '../constants/permissions';

/**
 * Права пользователя в зависимости от его роли
 *
 * @param role
 */
export const userPermissions = (role: Position) => {
    switch (role) {
        case(Position.READER): return READER_PERMISSIONS;
        case(Position.ADMINISTRATOR): return ADMINISTRATOR_PERMISSIONS;
        case(Position.LIBRARIAN): return LIBRARIAN_PERMISSIONS;
        case(Position.BIBLIOGRAPHER): return BIBLIOGRAPHER_PERMISSIONS;
    }
}

export const isUserEmployee = (user: IUser) => 'position' in user || 'pos' in user;

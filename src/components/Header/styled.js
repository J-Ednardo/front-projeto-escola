import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { colors, metrics } from '../../styles/theme';

export const Nav = styled.nav`
    background: ${colors.sidebarBg};
    width: ${metrics.sidebarWidth};
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 0;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 100;
    border-right: 1px solid rgba(255, 255, 255, 0.06);

    .logo {
        margin-bottom: 36px;
        text-decoration: none;

        .logo-icon {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
            transition: transform 0.2s ease, box-shadow 0.2s ease;

            &:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 16px rgba(37, 99, 235, 0.45);
            }
        }
    }

    .nav-items {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        width: 100%;
    }

    .auth-action {
        margin-top: auto;
        padding-top: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
`;

export const NavItem = styled(Link)`
    position: relative;
    width: 48px;
    height: 48px;
    border-radius: ${metrics.borderRadiusSm};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${colors.sidebarIcon};
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    text-decoration: none;

    &:hover {
        color: ${colors.sidebarIconActive};
        background: rgba(255, 255, 255, 0.08);
        transform: translateY(-1px);

        .tooltip {
            opacity: 1;
            visibility: visible;
            transform: translateX(0);
        }
    }

    &.active {
        color: #FFFFFF;
        background: ${colors.primary};
        box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);

        &::before {
            content: '';
            position: absolute;
            left: -12px;
            width: 4px;
            height: 20px;
            border-radius: 0 4px 4px 0;
            background: ${colors.primaryLight};
        }
    }

    &.logout-btn:hover {
        color: #EF4444;
        background: rgba(239, 68, 68, 0.12);
    }

    .tooltip {
        position: absolute;
        left: 60px;
        background: ${colors.sidebarSurface};
        color: #FFFFFF;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        visibility: hidden;
        transform: translateX(-6px);
        transition: all 0.2s ease;
        box-shadow: ${metrics.boxShadow};
        border: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 200;
    }
`;

export const UserBadge = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
    cursor: default;

    .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: ${props => props.$role === 'ADMIN' ? '#4F46E5' : props.$role === 'PROFESSOR' ? '#059669' : colors.sidebarSurface};
        border: 2px solid rgba(255, 255, 255, 0.2);
        color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 14px;
    }

    .role-tag {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: ${props => props.$role === 'ADMIN' ? '#C7D2FE' : props.$role === 'PROFESSOR' ? '#A7F3D0' : colors.sidebarIcon};
        background: ${props => props.$role === 'ADMIN' ? 'rgba(79, 70, 229, 0.25)' : props.$role === 'PROFESSOR' ? 'rgba(5, 150, 105, 0.25)' : 'rgba(255, 255, 255, 0.06)'};
        padding: 2px 6px;
        border-radius: 4px;
    }
`;


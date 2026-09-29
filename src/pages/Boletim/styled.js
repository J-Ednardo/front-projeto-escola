import styled from 'styled-components';
import { colors } from '../../styles/theme';

export const BoletimTable = styled.table`
    /* GlobalStyles handles most of the table styling */
    th, td {
        text-align: center;
    }

    th:first-child, td:first-child {
        text-align: left;
    }
`;

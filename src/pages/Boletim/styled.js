import styled from 'styled-components';

export const BoletimTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;

    th, td {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: left;
    }

    th {
        background-color: #eee;
    }

    tr:nth-child(even) {
        background-color: #f9f9f9;
    }
`;

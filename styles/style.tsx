import Styled from "styled-components";

export const FormWrapper = Styled.div`
  width: 100%;
  height: 100%;
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .ant-select-item{
    padding: 4px !important;
  }





  .ant-pagination-item {
    display: inline-block;
    min-width: 32px;
    height: 32px;
    margin-right: 0px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    line-height: 30px;
    text-align: center;
    vertical-align: middle;
    list-style: none;
    color: ${(props) =>
    props.mode === "dark" ? "#A8ABB0" : "#A8ABB0"} !important; 
    background-color: ${(props) =>
    props.mode === "dark" ? "#191B1E;" : "#fff"};
    border: 1px solid ${(props) =>
    props.mode === "dark" ? "#26282C;" : "#F5F7FA"};
    border-radius: 2px;
    outline: 0;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.ant-pagination-prev, .ant-pagination-jump-prev, .ant-pagination-jump-next {
  margin-right: 0px;
}
.ant-pagination-prev .ant-pagination-item-link, .ant-pagination-next .ant-pagination-item-link {
  display: flex;
  justify-content: center;
  align-items:center;
  width: 100%;
  height: 100%;
  padding: 0;
  font-size: 12px;
  text-align: center;
  color: ${(props) =>
    props.mode === "dark" ? "#A8ABB0" : "#A8ABB0"} !important; 
    background-color: ${(props) =>
    props.mode === "dark" ? "#191B1E;" : "#fff"};
    border: 1px solid ${(props) =>
    props.mode === "dark" ? "#26282C;" : "#F5F7FA"};
  border-radius: 2px;
  }
.ant-pagination-item a {
  display: block;
  padding: 0 6px;
  color: ${(props) => (props.mode === "dark" ? "#A8ABB0" : "#A8ABB0")};
  transition: none;
}
.ant-pagination-item-active a {
  color: ${(props) => (props.mode === "dark" ? "#A8ABB0" : "#A8ABB0")};
}

  .ant-pagination-item-active {
    font-weight: 500;
    color: ${(props) => (props.mode === "dark" ? "#A8ABB0" : "#000429")}; 
    background: ${(props) => (props.mode === "dark" ? "#212326" : "#F5F7FA")};
    border-color: ${(props) => (props.mode === "dark" ? "#191B1E" : "#fffs")};
}

  .ant-form-item, .ant-form-item-label > label {
    color: ${(props) => (props.mode === "dark" ? "#fff" : "#000429")} ; 
  }
  
  .ant-switch-inner {
    display: block;
    margin: 5px 10px 0 45px; 
    color: #fff;
    font-size: 12px;
    transition: margin 0.2s;
    
}

.ant-switch-handle {
  left: 0px;
}

.ant-switch{
  background: #F3F4F7;
}
.ant-switch-checked .ant-switch-inner {
  margin: 5px 45px 0 10px !important;

}
.ant-switch-checked {
  background-color: #26282C;
}
  .ant-switch-handle {
    top:0px;
    width: 50px;
    height: 36px;
  }
  .ant-switch {
    min-width: 44px;
    width: 102px;
    height: 37px;
}

.ant-switch-checked .ant-switch-handle {
  left: calc(100% - 40px - 5px);
}
  .ant-switch-handle::before {
    background-color: #fff;
    border-radius: 999px;
   
}

  .ant-form-vertical .ant-form-item-label > label,
  .ant-col-24.ant-form-item-label > label,
  .ant-col-xl-24.ant-form-item-label > label {
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    margin: 16px 0px;

    display: flex;
    align-items: center;
    letter-spacing: -0.02em;

    color: ${(props) => (props.mode === "dark" ? "#fff" : "#000429")} ;

  }

  input[type="number"] {
    -moz-appearance: textfield;
  }
  .ant-radio-checked .ant-radio-inner {
    border-color: #5f31b4 !important ;
  }

  .ant-radio-checked .ant-radio-inner:after {
    background-color: ${(props) => (props.alt ? "#000429" : "none")};
  }

  .ant-radio:hover .ant-radio-inner {
    border-color: #5f31b4;
  }
  .ant-input-status-error:not(.ant-input-disabled):not(.ant-input-borderless).ant-input, .ant-input-status-error:not(.ant-input-disabled):not(.ant-input-borderless).ant-input:hover,.ant-input-affix-wrapper-status-error:not(.ant-input-affix-wrapper-disabled):not(.ant-input-affix-wrapper-borderless).ant-input-affix-wrapper {
    background: #26282c;
    border-radius: 4px;
}
  .ant-radio-group .ant-radio-group-outline {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 21px;
    display: flex;
    align-items: center;
    color: #17151e;
  }
  .ant-input,
  .ant-input-affix-wrapper,
  ant-select-item-option,
  .ant-picker,.ant-select:not(.ant-select-customize-input) .ant-select-selector {
    background: ${(props) => (props.mode === "dark" ? "#26282C" : "#F3F4F7")};
    border: 2px solid ${(props) => {
    if (props.mode === "dark") return "#26282C";
    return props.alt ? "#0078FF" : "#F3F4F7";
  }};
    border-radius: 4px;
    box-sizing: border-box;
    border-radius: 4px;
    height: 50px;
    font-size: 14px;
    line-height: 24px;
    display: flex;
    align-items: center;

    color:${(props) =>
    props.alt ? (props.mode === "dark" ? "#fff" : "#000429") : "#8A91A8"};
    font-style: normal;
    font-weight: normal;
  }
  .ant-input-affix-wrapper {
    padding-top: 10px;
  }
  .ant-input-affix-wrapper .ant-input {
    height: 100% !important;
    margin-bottom: 2px;
  }
  .ant-table-row {
    :hover {
      color:yellow;
  }
  }
  
  

  .ant-select-selection-placeholder {
    color: ${(props) => {
    if (props.mode === "dark") return "#fff";
    return props.alt ? "#0078FF" : "#8A91A8";
  }};
  }
  ::placeholder {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    /* identical to box height */

    display: flex;
    align-items: center;
    letter-spacing: -0.02em;

    color: #8A91A8;
  }
  .ant-select-selection-item{
    font-size: 14px;
    line-height: 17px;
    margin: 0px 2px;
    display: flex;
    align-items: center;
    letter-spacing: -0.02em;
    color: #8A91A8;

  }

  
  .price-wrapper {
    background: #f7f7f8;
    height: 40px;
    font-size: 18px;
    line-height: 24px;
    border: 1px solid #f0edf2;
    border-radius: 4px;
  }
  .ant-form-item {
    margin-bottom: 5px;
  }
  .ant-form-vertical .ant-form-item-label,
  .ant-col-24.ant-form-item-label,
  .ant-col-xl-24.ant-form-item-label {
    padding: 0 0 0px;
  }
  
`;

export const TableStyle = Styled.div`


  .ant-table-thead > tr > th {
    font-weight: bold;
    font-size: 12px;
    line-height: 19px;

    color: #8A91A8;
    text-align: left;
    background:  ${(props) => (props.mode === "dark" ? "#191B1E" : "#fff")};
    border: none !important;
    transition: background 0.3s ease;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 20px;
    margin: 0px 10px;
  }
  .ant-table-tbody > tr.ant-table-row {
    border-radius: 20px;
    cursor: pointer;
    background: ${(props) => (props.mode === "dark" ? "#191B1E" : "white")}

  }
  .ant-table-tbody > tr.ant-table-row:hover > td {
    background: ${(props) => (props.mode === "dark" ? "#191B1E" : "#F5F7FA")};
  }
  
  .ant-table-tbody > tr > td {
    margin: 0px 10px;
  }
  .ant-table-tbody > tr > td {
    border-bottom: 1.5px solid ${(props) =>
    props.mode === "dark" ? "#191B1E" : "#F5F7FA"};
    transition: background 0.3s;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.02em;
    font-style: normal;
    font-weight: normal;
    color: #8A91A8;
    }
  .ant-table-thead > tr > th, .ant-table-tbody > tr > td, .ant-table tfoot > tr > th, .ant-table tfoot > tr > td {
      position: relative;
      padding: 10px 10px;
      word-wrap: break-word;
      border-bottom: 1.5px solid ${(props) =>
    props.mode === "dark" ? "#26282C" : "#F5F7FA"};
  }
  

  .ant-table-thead>tr.ant-table-row-hover:not(.ant-table-expanded-row)>td, 
.ant-table-tbody>tr.ant-table-row-hover:not(.ant-table-expanded-row)>td, 
.ant-table-thead>tr:hover:not(.ant-table-expanded-row)>td, 
.ant-table-tbody>tr:hover:not(.ant-table-expanded-row)>td {
    background: unset;
}

.ant-select-dropdown {
  background: green !important;
}
`;

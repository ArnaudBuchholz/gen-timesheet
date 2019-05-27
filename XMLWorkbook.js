'use strict'

class XMLWorkbook {

  constructor (year) {
    this._content = [`<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:html="http://www.w3.org/TR/REC-html40">
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
    <Author>Buchholz, Arnaud</Author>
    <Created>${new Date().toISOString()}</Created>
  </DocumentProperties>
  <Styles>
    <Style ss:ID="sDefault">
      <Alignment ss:Vertical="Bottom" ss:WrapText="1"/>
      <Font ss:FontName="Arial" ss:Color="#000000"/>
    </Style>
    <Style ss:ID="sDateColumn">
      <Alignment ss:Vertical="Bottom" ss:WrapText="1"/>
      <Font ss:FontName="Arial" ss:Bold="1"/>
      <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
      <NumberFormat ss:Format="m/d/yyyy\ h:mm:ss"/>
    </Style>
    <Style ss:ID="sHoursColumn">
     <Alignment ss:Vertical="Bottom" ss:WrapText="1"/>
     <Borders>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#000000"/>
     </Borders>
     <Font ss:FontName="Arial" ss:Bold="1"/>
     <Interior ss:Color="#C9DAF8" ss:Pattern="Solid"/>
     <NumberFormat ss:Format="m/d/yyyy\ h:mm:ss"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="${year}">
   <Table ss:ExpandedColumnCount="27" x:FullColumns="1" x:FullRows="1" ss:StyleID="sDefault" ss:DefaultColumnWidth="79.5">
     <Column ss:StyleID="sDefault" ss:AutoFitWidth="0" ss:Width="41"/>
     <Column ss:StyleID="sDefault" ss:AutoFitWidth="0" ss:Width="48"/>
     <Column ss:StyleID="sDefault" ss:AutoFitWidth="0" ss:Width="40" ss:Span="18"/>
     <Row ss:AutoFitHeight="0">
      <Cell ss:StyleID="sDateColumn"/>
      <Cell ss:StyleID="sHoursColumn"><Data ss:Type="String">Heures</Data></Cell>
     </Row>
`]
  }

  toString () {
    this._content.push(`    </Table>
  </Worksheet>
</Workbook>`)
    return `data:application/vnd.ms-excel,${encodeURIComponent(this._content.join(''))}`
  }

}

window.XMLWorkbook = XMLWorkbook

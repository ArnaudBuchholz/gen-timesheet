'use strict'

var DAYS = 'Dimanche,Lundi,Mardi,Mercredi,Jeudi,Vendredi,Samedi'.split(',')
var MONTHS = 'Janvier,Février,Mars,Avril,Mai,Juin,Juillet,Août,Septembre,Octobre,Novembre,Décembre'.split(',')

class XMLWorkbook {
  constructor (year, weekDays) {
    this._year = year
    this._weekDays = weekDays
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
      <NumberFormat ss:Format="m/d/yyyy\\ h:mm:ss"/>
    </Style>
    <Style ss:ID="sHoursColumn">
     <Alignment ss:Vertical="Bottom" ss:WrapText="1"/>
     <Borders>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#000000"/>
     </Borders>
     <Font ss:FontName="Arial" ss:Bold="1"/>
     <Interior ss:Color="#C9DAF8" ss:Pattern="Solid"/>
     <NumberFormat ss:Format="m/d/yyyy\\ h:mm:ss"/>
    </Style>
    <Style ss:ID="sDayHeader">
      <Alignment ss:Vertical="Bottom" ss:WrapText="1"/>
      <Borders>
         <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#000000"/>
      </Borders>
      <Font ss:FontName="Arial" ss:Bold="1"/>
      <Interior ss:Color="#EFEFEF" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="sWeekHeader">
     <Alignment ss:Vertical="Bottom" ss:WrapText="1"/>
     <Font ss:FontName="Arial" ss:Bold="1"/>
     <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
     <NumberFormat ss:Format="dd&quot;/&quot;mm"/>
    </Style>
    <Style ss:ID="sBreakoutHeader">
     <Alignment ss:Vertical="Bottom" ss:WrapText="1"/>
     <Font ss:FontName="Arial" ss:Bold="1"/>
     <Interior ss:Color="#B4A7D6" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="sWeekTotal">
      <Alignment ss:Vertical="Bottom" ss:WrapText="1"/>
      <Borders>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#000000"/>
      </Borders>
      <Font ss:FontName="Arial"/>
      <Interior ss:Color="#C9DAF8" ss:Pattern="Solid"/>
      <NumberFormat ss:Format="[h]:mm:ss"/>
    </Style>
    <Style ss:ID="sDayFrom">
     <Alignment ss:Vertical="Bottom" ss:WrapText="1"/>
     <Borders>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#000000"/>
     </Borders>
     <Font ss:FontName="Arial"/>
     <Interior ss:Color="#EFEFEF" ss:Pattern="Solid"/>
     <NumberFormat ss:Format="hh:mm"/>
     <Protection ss:Protected="0"/>
    </Style>
    <Style ss:ID="sDayTo">
     <Alignment ss:Vertical="Bottom" ss:WrapText="1"/>
     <Font ss:FontName="Arial"/>
     <NumberFormat ss:Format="hh:mm"/>
     <Protection ss:Protected="0"/>
    </Style>
    <Style ss:ID="sDayBreak">
     <Alignment ss:Vertical="Bottom" ss:WrapText="1"/>
     <Font ss:FontName="Arial"/>
     <Interior ss:Color="#F4CCCC" ss:Pattern="Solid"/>
     <NumberFormat ss:Format="hh:mm"/>
     <Protection ss:Protected="0"/>
    </Style>
    <Style ss:ID="sDayTotal">
     <Alignment ss:Vertical="Bottom" ss:WrapText="1"/>
     <Borders>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#000000"/>
     </Borders>
     <Font ss:FontName="Arial"/>
     <Interior ss:Color="#D9EAD3" ss:Pattern="Solid"/>
     <NumberFormat ss:Format="hh:mm"/>
    </Style>
    <Style ss:ID="sDayOut">
     <Alignment ss:Vertical="Bottom" ss:WrapText="1"/>
     <Borders>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#000000"/>
     </Borders>
     <Font ss:FontName="Arial"/>
     <Interior ss:Color="#000000" ss:Pattern="Solid"/>
     <NumberFormat ss:Format="m/d/yyyy\ h:mm:ss"/>
    </Style>
    <Style ss:ID="sBreakoutTotal">
      <Alignment ss:Vertical="Bottom" ss:WrapText="1"/>
      <Borders>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#000000"/>
      </Borders>
      <Font ss:FontName="Arial" ss:Bold="1"/>
      <Interior ss:Color="#B4A7D6" ss:Pattern="Solid"/>
      <NumberFormat ss:Format="[h]:mm:ss"/>
    </Style>
    <Style ss:ID="sBreakoutCells">
     <Alignment ss:Vertical="Bottom" ss:WrapText="1"/>
     <Borders>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#000000"/>
     </Borders>
     <Font ss:FontName="Arial"/>
     <Interior ss:Color="#B4A7D6" ss:Pattern="Solid"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="${year}" ss:Protected="1">
   <Table ss:ExpandedColumnCount="${4 * weekDays.length + 2}" x:FullColumns="1" x:FullRows="1" ss:StyleID="sDefault" ss:DefaultColumnWidth="79.5">
     <Column ss:StyleID="sDefault" ss:AutoFitWidth="0" ss:Width="41"/>
     <Column ss:StyleID="sDefault" ss:AutoFitWidth="0" ss:Width="48"/>
     <Column ss:StyleID="sDefault" ss:AutoFitWidth="0" ss:Width="40" ss:Span="${4 * weekDays.length - 1}"/>
     <Row ss:AutoFitHeight="0">
      <Cell ss:StyleID="sDateColumn"/>
      <Cell ss:StyleID="sHoursColumn"><Data ss:Type="String">Heures</Data></Cell>
`]
    weekDays.forEach(day =>
      this._content.push(`      <Cell ss:MergeAcross="3" ss:StyleID="sDayHeader"><Data ss:Type="String">${DAYS[day]}</Data></Cell>`)
    )
    this._content.push(`     </Row>
`)
    this._weeks = 0
  }

  renderWeek (dates, formats) {
    ++this._weeks
    const formula = formats
      .map((format, index) => format === 0 ? index : undefined)
      .filter(index => index !== undefined)
      .map(index => `RC[${4 * (index + 1)}]`)
      .join ('+')
    this._content.push(`     <Row ss:AutoFitHeight="0">
      <Cell ss:StyleID="sWeekHeader"><Data ss:Type="DateTime">${dates[0].toISOString()}</Data></Cell>
      <Cell ss:StyleID="sWeekTotal" ss:Formula="=${formula}"><Data ss:Type="DateTime">1899-12-31T00:00:00.000</Data></Cell>
`)
    dates.forEach((day, index) => {
      if (formats[index] !== 0) {
        this._content.push(`      <Cell ss:StyleID="sDayOut" ss:MergeAcross="3"/>
`)
      } else {
        this._content.push(`      <Cell ss:StyleID="sDayFrom"/>
      <Cell ss:StyleID="sDayTo"/>
      <Cell ss:StyleID="sDayBreak"/>
      <Cell ss:StyleID="sDayTotal" ss:Formula="=RC[-2]-RC[-3]-RC[-1]"><Data ss:Type="DateTime">1899-12-31T00:00:00.000</Data></Cell>
`)}
    })
    this._content.push(`     </Row>
`)
  }

  renderBreakout (date) {
    const month = MONTHS[date.getMonth()]
    this._content.push(`     <Row ss:AutoFitHeight="0">
`)
    if (date.getDate() === 15) {
      this._content.push(`       <Cell ss:StyleID="sBreakoutHeader"><Data ss:Type="String">15/</Data></Cell>
`)
    } else {
      this._content.push(`       <Cell ss:StyleID="sBreakoutHeader"><Data ss:Type="String">${month}</Data></Cell>
`)
    }
    const rows = []
    while (this._weeks > 0) {
      rows.push(`R[-${this._weeks}]C`)
      --this._weeks
    }
    const formula = rows.join('+')
    this._content.push(`       <Cell ss:StyleID="sBreakoutTotal" ss:Formula="=${formula}"><Data ss:Type="DateTime">1899-12-31T00:00:00.000</Data></Cell>
       <Cell ss:StyleID="sBreakoutCells" ss:MergeAcross="${4 * this._weekDays.length - 1}"/>
     </Row>
`)
    this._weeks = 0
  }

  toString () {
    this._content.push(`    </Table>
  </Worksheet>
</Workbook>`)
    return `data:application/vnd.ms-excel,${encodeURIComponent(this._content.join(''))}`
  }
}

window.XMLWorkbook = XMLWorkbook

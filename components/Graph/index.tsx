import {
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area
} from 'recharts'

import styles from './Graph.module.css'

import { Service } from './../../interfaces/services'

interface GraphDataItem {
  hour: string,
  uv: number,
  pv: number
}

interface Props {
  name: string,
  data: Array<GraphDataItem>
}

export default function Graph({
  name,
  data
}: Props) {
  return (
    <div className={styles.container}>
      <p>{name}</p>

      <ResponsiveContainer
        width='100%'
        minWidth={300}
        height={250}
      >
        <AreaChart 
          // width={730} 
          // height={250} 
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis interval={14} dataKey='hour' />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
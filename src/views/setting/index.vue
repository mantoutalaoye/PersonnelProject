<template>
  <div class="Setting-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户管理" name="first">
        <el-button type="primary" size="small" style="margin-bottom:10px" @click="showDialog=true">+ 新增角色</el-button>
        <user-set :list="list" @setRole="setRole" />
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">
        <Bossinfo :form-data="formData" />
      </el-tab-pane>
    </el-tabs>
    <updeRole :show-dialog.sync="showDialog" :role-form="roleForm" @updateroleForm="roleForm=null" @getrole="getRoleList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import userSet from './components/userSet.vue'
import Bossinfo from './components/Bossinfo.vue'
import updeRole from './components/updeRole.vue'
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail } from '@/api/setting'
export default {
  components: {
    userSet,
    Bossinfo,
    updeRole
  },
  data() {
    return {
      activeName: 'first',
      list: [],
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 10,
        total: 0 // 记录总数
      },
      formData: {},
      showDialog: false,
      roleForm: null
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    this.getRoleList()
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
      this.getCompanyInfo()
    },
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
      console.log(rows)
    },
    // 修改时获取该对象的信息
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.userInfo.companyId)
      console.log(this.formData)
    },
    async setRole(obj) {
      if (obj.is === 2) {
        await this.$confirm('确定要删除该部门吗').then(() => {
          // 如果点击了确定就会进入then
          return deleteRole(this.list[obj.index].id)
        }).then(res => {
          console.log(res)
          if (res === null) {
            this.$message.success('删除成功')
          }
        })
      } else if (obj.is === 1) {
        this.roleForm = await getRoleDetail(this.list[obj.index].id)
        this.showDialog = true
        return 0
      }
      this.getRoleList()
    }
  }
}
</script>

<style lang="scss" scoped>
.Setting-container{
  margin: 1.2%;
  padding: 4%;
  background-color: #fff;

}
</style>

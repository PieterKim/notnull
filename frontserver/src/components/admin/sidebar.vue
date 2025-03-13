<template>
  <div id="sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
    <nav>
      <ul>
        <li>
          <router-link to="/" class="nav-link">
            <span class="material-icons">home</span>
            <span v-if="!isCollapsed">Admin Page</span>
          </router-link>
        </li>
        <li>
          <a @click="toggleMenu('Tables')" class="nav-link">
            <span class="material-icons">drag_indicator</span>
            <span v-if="!isCollapsed">Tables</span>
            <span class="material-icons">
              {{ activeMenu === 'Tables' ? 'expand_less' : 'expand_more' }}
            </span>
          </a>
          <ul v-if="activeMenu === 'Tables'" class="sub-menu">
            <li>
              <router-link to="/admin/users" class="nav-link">
                <span class="material-icons">people</span>
                <span v-if="!isCollapsed">사용자 목록</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/manageOrders" class="nav-link">
                <span class="material-icons">receipt</span>
                <span v-if="!isCollapsed">주문 목록</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/manageProducts" class="nav-link">
                <span class="material-icons">inventory</span>
                <span v-if="!isCollapsed">상품 목록</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/supplyFactories" class="nav-link">
                <span class="material-icons">factory</span>
                <span v-if="!isCollapsed">공급처 관리</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/productLocations" class="nav-link">
                <span class="material-icons">place</span>
                <span v-if="!isCollapsed">원산지 관리</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/userRatings" class="nav-link">
                <span class="material-icons">star_rate</span>
                <span v-if="!isCollapsed">사용자 등급 관리</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/coupons" class="nav-link">
                <span class="material-icons">local_offer</span>
                <span v-if="!isCollapsed">쿠폰 관리</span>
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      activeMenu: null,
      isCollapsed: false,
    };
  },
  methods: {
    toggleMenu(menuName) {
      this.activeMenu = this.activeMenu === menuName ? null : menuName;
    },
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    },
  },
};
</script>

<style scoped>
#sidebar {
  position: fixed;
  top: 90px;
  left: 0;
  height: calc(100vh - 90px);
  width: 200px;
  background-color: #1a1a1a;
  transition: width 0.3s ease;
  overflow-x: hidden;
}

.sidebar-collapsed {
  width: 60px;
}

nav ul {
  list-style-type: none;
  padding: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 10px;
  color: #e0e0e0;
  text-decoration: none;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.nav-link:hover {
  background-color: #333333 !important;
  color: #d4af37 !important;
}

.sub-menu {
  padding-left: 20px;
}

.material-icons {
  margin-right: 8px;
  font-size: 95%;
}

@media (max-width: 768px) {
  #sidebar {
    width: 80px;
  }
  .nav-link span:not(.material-icons) {
    display: none;
  }
}
</style>
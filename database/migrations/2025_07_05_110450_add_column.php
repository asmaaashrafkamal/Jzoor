<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
//            Schema::table('orders', function (Blueprint $table) {
//       $table->foreignId('delivery_person_id')
//       ->constrained('admins')
//       ->onDelete('cascade');
//          $table->decimal('shipping_price', 10, 2);
//
//         });
// Schema::table('orders', function (Blueprint $table) {
//             $table->dropColumn('status'); // ✅ Drop the column
//         });
Schema::table('users', function (Blueprint $table) {
    $table->enum('status', ['Inactive', 'Active', 'VIP'])
          ->default('Inactive'); // ✅ Default is valid
});

    }

    public function down()
    {

        // Schema::table('orders', function (Blueprint $table) {
        //     $table->string('status')->default('new')->change(); // or revert to original type
        // });
    }
};

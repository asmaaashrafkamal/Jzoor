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
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('status'); // 🔻 Drop old column
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->enum('status', ['Preparing', 'Pending', 'Shipped', 'Delivered', 'Canceled', 'Waiting Picked Up'])
                  ->default('Pending'); // ➕ Add new column

        });
    }

    public function down()
    {
        // Schema::table('orders', function (Blueprint $table) {
        //     $table->string('status')->default('new')->change(); // or revert to original type
        // });
    }
};

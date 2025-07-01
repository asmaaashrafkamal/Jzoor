<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Admin;
return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admins', function (Blueprint $table) {
             $table->id();
            $table->string('full_name')->nullable();
            $table->string('email')->nullable()->unique();
            $table->string('password')->nullable();
            $table->enum('status', allowed: ['active', 'inactive'])->default('active');

            $table->enum('type',[Admin::SELLER_TYPE,Admin::ADMIN_TYPE,Admin::DELIVERY_TYPE])->default(Admin::ADMIN_TYPE);
            $table->rememberToken();
            $table->softDeletes();
            $table->timestamps();

            $table->index('full_name');
            $table->index('email');
            $table->index('type');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('admins');
    }
};